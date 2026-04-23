import hashlib
from fastapi import APIRouter, Depends, UploadFile, File
from app.schemas.requests import AnalyzeTextRequest, AnalyzeURLRequest, WordHeatmapRequest
from app.schemas.responses import AnalysisResponse, WordHeatmapResponse
from app.schemas.enums import InputType
from app.api.dependencies import get_analysis_service, get_input_handler_service, get_cache_service
from app.services.analysis import AnalysisService
from app.services.input_handlers import InputHandlerService
from app.services.cache import CacheService

router = APIRouter()

async def get_cached_or_analyze(
    cache: CacheService, 
    analysis_service: AnalysisService, 
    text: str, 
    input_type: InputType
) -> AnalysisResponse:
    # Generate cache key based on content hash
    content_hash = hashlib.sha256(text.encode()).hexdigest()
    cache_key = f"analysis:{content_hash}"
    
    cached_data = await cache.get(cache_key)
    if cached_data:
        return AnalysisResponse(**cached_data)
        
    result = await analysis_service.analyze(text, input_type)
    
    # Store in cache
    await cache.set(cache_key, result.model_dump(mode="json"))
    return result

@router.post("/text", response_model=AnalysisResponse)
async def analyze_text(
    request: AnalyzeTextRequest,
    analysis_service: AnalysisService = Depends(get_analysis_service),
    input_handler: InputHandlerService = Depends(get_input_handler_service),
    cache: CacheService = Depends(get_cache_service)
):
    cleaned_text = input_handler.process_text(request.text)
    return await get_cached_or_analyze(cache, analysis_service, cleaned_text, InputType.TEXT)

@router.post("/url", response_model=AnalysisResponse)
async def analyze_url(
    request: AnalyzeURLRequest,
    analysis_service: AnalysisService = Depends(get_analysis_service),
    input_handler: InputHandlerService = Depends(get_input_handler_service),
    cache: CacheService = Depends(get_cache_service)
):
    # Only use strings for URL
    text = input_handler.process_url(str(request.url))
    return await get_cached_or_analyze(cache, analysis_service, text, InputType.URL)

@router.post("/pdf", response_model=AnalysisResponse)
async def analyze_pdf(
    file: UploadFile = File(...),
    analysis_service: AnalysisService = Depends(get_analysis_service),
    input_handler: InputHandlerService = Depends(get_input_handler_service),
    cache: CacheService = Depends(get_cache_service)
):
    text = await input_handler.process_pdf(file)
    return await get_cached_or_analyze(cache, analysis_service, text, InputType.PDF)

@router.post("/image", response_model=AnalysisResponse)
async def analyze_image(
    file: UploadFile = File(...),
    analysis_service: AnalysisService = Depends(get_analysis_service),
    input_handler: InputHandlerService = Depends(get_input_handler_service),
    cache: CacheService = Depends(get_cache_service)
):
    text = await input_handler.process_image(file)
    return await get_cached_or_analyze(cache, analysis_service, text, InputType.IMAGE)

@router.post("/word-heatmap", response_model=WordHeatmapResponse)
async def analyze_word_heatmap(
    request: WordHeatmapRequest,
    input_handler: InputHandlerService = Depends(get_input_handler_service)
):
    from app.models.manager import model_manager
    cleaned_text = input_handler.process_text(request.text)
    lr_model = model_manager.get_lr()
    heatmap = lr_model.predict_word_heatmap(cleaned_text)
    return WordHeatmapResponse(words=heatmap)
