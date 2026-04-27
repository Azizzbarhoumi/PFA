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
            import requests
            from bs4 import BeautifulSoup
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
            }
            
            session = requests.Session()
            session.headers.update(headers)
            
            response = session.get(url, timeout=30, allow_redirects=True, headers=headers)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            title = soup.find('title')
            if title:
                title = title.get_text(strip=True)
            else:
                title = soup.find('h1')
                title = title.get_text(strip=True) if title else "No title"
            
            for tag in soup(['script', 'style', 'nav', 'header', 'footer', 'aside', 'iframe', 'noscript']):
                tag.decompose()
            
            article = soup.find('article') or soup.find('main') or soup.find('div', class_=lambda x: x and 'article' in str(x).lower() if x else False)
            if article:
                paragraphs = article.find_all('p')
                text = ' '.join(p.get_text(strip=True) for p in paragraphs)
            else:
                text = soup.get_text(separator=' ', strip=True)
            
            text = f"{title}\n\n{text[:15000]}" if len(text) > 100 else text
            text = title if text.strip() else "No content extracted"
            
            if not text.strip() or text == "No content extracted":
                raise ValueError("No content extracted from URL")
                
            return clean_text(text)
        except requests.exceptions.Timeout:
            logger.error("url_scraping_timeout", url=url)
            raise HTTPException(status_code=408, detail=f"Request timed out. The website took too long to respond. Try a different URL.")
        except requests.exceptions.RequestException as e:
            logger.error("url_scraping_failed", url=url, error=str(e))
            raise HTTPException(status_code=400, detail=f"Failed to scrape URL: {str(e)}")
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
