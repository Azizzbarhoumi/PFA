import asyncio
from app.schemas.responses import ParagraphAnalysisResponse, ParagraphScore
from app.schemas.enums import Verdict
from app.utils.text import chunk_text
from app.services.analysis import AnalysisService # Use analysis service for inner components
from app.core.logging import get_logger

logger = get_logger(__name__)

class ParagraphAnalysisService:
    def __init__(self, analysis_service: AnalysisService):
        self.analysis_service = analysis_service

    async def analyze(self, text: str) -> ParagraphAnalysisResponse:
        logger.info("starting_paragraph_analysis")
        
        # 1. Chunk Text - use smaller chunks for better granularity
        chunks = chunk_text(text, chunk_size=50)
        logger.info("chunked_text", chunks_count=len(chunks), chunks=chunks[:3])
        
        # 2. Analyze each chunk in parallel
        tasks = []
        from app.schemas.enums import InputType
        for idx, chunk in enumerate(chunks):
            # Process all chunks, no minimum word filter
            tasks.append(self._analyze_chunk(chunk, idx))
            
        results = await asyncio.gather(*tasks)
        
        # 3. Aggregate results
        if not results:
            # Fallback if no valid chunks
            return ParagraphAnalysisResponse(
                paragraphs=[],
                overall_verdict=Verdict.REAL,
                heatmap_data=[]
            )
            
        paragraphs = []
        heatmap_data = []
        
        fake_votes = 0
        total_confidence = 0.0
        
        for res in results:
            paragraphs.append(res)
            heatmap_data.append({
                "index": res.index,
                "score": res.suspicion_score,
                "verdict": res.verdict.value
            })
            if res.verdict == Verdict.FAKE:
                fake_votes += 1
            total_confidence += res.confidence
            
        overall = Verdict.FAKE if fake_votes > (len(results) / 2) else Verdict.REAL
        
        # Sort heatmap data so frontend can rank easily
        heatmap_data.sort(key=lambda x: x["score"], reverse=True)
        
        logger.info("paragraph_analysis_complete", total_chunks=len(results), fake_chunks=fake_votes)
        
        return ParagraphAnalysisResponse(
            paragraphs=paragraphs,
            overall_verdict=overall,
            heatmap_data=heatmap_data
        )

    async def _analyze_chunk(self, chunk: str, index: int) -> ParagraphScore:
        # We use BERT directly here for speed on small chunks
        # instead of full AnalysisService to save time, or we can use the full one.
        # Let's use the BERT model directly from model manager to be efficient.
        bert = self.analysis_service.model_manager.get_bert()
        loop = asyncio.get_running_loop()
        
        from app.services.analysis import thread_pool
        result = await loop.run_in_executor(thread_pool, bert.predict, chunk)
        
        # Calculate a suspicion score [0-100]
        # If Fake, score = 50 + (confidence * 50)
        # If Real, score = 50 - (confidence * 50)
        if result.label == Verdict.FAKE:
            score = 50.0 + (result.confidence * 50.0)
        else:
            score = 50.0 - (result.confidence * 50.0)
            
        return ParagraphScore(
            index=index,
            text=chunk,
            verdict=result.label,
            confidence=result.confidence,
            suspicion_score=round(score, 2)
        )
