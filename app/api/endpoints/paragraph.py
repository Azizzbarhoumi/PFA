import hashlib
import uuid
from fastapi import APIRouter, Depends
from app.schemas.requests import ParagraphAnalysisRequest
from app.schemas.responses import ParagraphAnalysisFullResponse
from app.api.dependencies import get_paragraph_analysis_service, get_cache_service
from app.services.paragraph_analysis import ParagraphAnalysisService
from app.services.cache import CacheService

router = APIRouter()

@router.post("/paragraphs", response_model=ParagraphAnalysisFullResponse)
async def analyze_paragraphs(
    request: ParagraphAnalysisRequest,
    para_service: ParagraphAnalysisService = Depends(get_paragraph_analysis_service),
    cache: CacheService = Depends(get_cache_service)
):
    content_hash = hashlib.sha256(request.text.encode()).hexdigest()
    cache_key = f"paragraph_analysis:{content_hash}"
    
    cached_data = await cache.get(cache_key)
    if cached_data:
        return ParagraphAnalysisFullResponse(**cached_data)
        
    result = await para_service.analyze(request.text)
    
    fake_count = sum(1 for p in result.paragraphs if p.verdict.value == "FAKE")
    total_confidence = sum(p.confidence for p in result.paragraphs) / len(result.paragraphs) if result.paragraphs else 0
    
    para_list = []
    for p in result.paragraphs:
        tier = 3 if p.suspicion_score >= 75 else (2 if p.suspicion_score >= 50 else (1 if p.suspicion_score >= 25 else 0))
        para_list.append({
            "paragraph_index": p.index,
            "text": p.text,
            "verdict": p.verdict.value,
            "confidence": p.confidence,
            "suspicion_score": p.suspicion_score,
            "heatmap_tier": tier
        })
    
    response = ParagraphAnalysisFullResponse(
        id=str(uuid.uuid4()),
        verdict=result.overall_verdict.value,
        confidence=round(total_confidence, 4),
        suspicious_paragraph_count=fake_count,
        total_paragraphs=len(result.paragraphs),
        paragraphs=para_list,
        disagreement=None
    )
    
    await cache.set(cache_key, response.model_dump(mode="json"))
    return response
