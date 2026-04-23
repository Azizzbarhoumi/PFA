import io
import fitz  # PyMuPDF
from fastapi import UploadFile, HTTPException
from newspaper import Article
from groq import Groq
import base64

from app.core.config import settings
from app.core.logging import get_logger
from app.utils.text import clean_text

logger = get_logger(__name__)

class InputHandlerService:
    def __init__(self):
        self.groq_client = Groq(api_key=settings.GROQ_API_KEY) if settings.GROQ_API_KEY else None

    def process_text(self, text: str) -> str:
        return clean_text(text)

    def process_url(self, url: str) -> str:
        try:
            logger.info("scraping_url", url=url)
            article = Article(url)
            article.download()
            article.parse()
            text = f"{article.title}\n\n{article.text}"
            return clean_text(text)
        except Exception as e:
            logger.error("url_scraping_failed", url=url, error=str(e))
            raise HTTPException(status_code=400, detail=f"Failed to scrape URL: {str(e)}")

    async def process_pdf(self, file: UploadFile) -> str:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF")
            
        try:
            logger.info("parsing_pdf", filename=file.filename)
            content = await file.read()
            pdf_stream = io.BytesIO(content)
            
            text = ""
            with fitz.open(stream=pdf_stream, filetype="pdf") as doc:
                for page in doc:
                    text += page.get_text() + "\n"
                    
            if not text.strip():
                raise ValueError("PDF appears to be empty or scanned without OCR text")
                
            return clean_text(text)
        except Exception as e:
            logger.error("pdf_parsing_failed", error=str(e))
            raise HTTPException(status_code=400, detail=f"Failed to process PDF: {str(e)}")

    async def process_image(self, file: UploadFile) -> str:
        if not self.groq_client:
            raise HTTPException(status_code=503, detail="Groq API key not configured for Vision capabilities. Screenshot analysis requires a Groq API key.")
            
        try:
            logger.info("processing_image_ocr", filename=file.filename)
            content = await file.read()
            base64_image = base64.b64encode(content).decode('utf-8')
            media_type = file.content_type or "image/png"
            
            response = self.groq_client.chat.completions.create(
                model="meta-llama/llama-4-scout-17b-16e-instruct",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": "Extract all the text from this image. Only return the extracted text, nothing else. If there is no text, say 'No text found in image'."},
                            {"type": "image_url", "image_url": {"url": f"data:{media_type};base64,{base64_image}"}}
                        ]
                    }
                ],
                temperature=0.0
            )
            
            extracted_text = response.choices[0].message.content
            
            if not extracted_text or "no text found" in extracted_text.lower():
                raise HTTPException(status_code=400, detail="No text could be extracted from the image. Please upload a clearer image with readable text.")
                
            return clean_text(extracted_text)
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error("image_processing_failed", error=str(e))
            raise HTTPException(status_code=400, detail=f"Failed to process image: {str(e)}")
