import json
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.requests import ReportRequest
from app.schemas.responses import ReportResponse, AnalysisResponse
from app.api.dependencies import get_report_service, get_cache_service
from app.services.report import ReportService
from app.services.cache import CacheService

router = APIRouter()

@router.post("", response_model=ReportResponse)
async def generate_report(
    request: ReportRequest,
    report_service: ReportService = Depends(get_report_service),
    cache: CacheService = Depends(get_cache_service)
):
    # To generate report, we should ideally fetch the analysis from cache or DB using analysis_id
    # Since we aren't using a persistent DB, we MUST find it in Redis cache across all keys
    # Optimization: Analysis ID should be the cache key if we expect it to be queried.
    # We didn't do this above, so let's try to lookup all `analysis:*` keys (not optimal for production, but okay here)
    # Alternatively, the client passes the full analysis object. Let's assume we find it.
    
    if not cache.redis_client:
        raise HTTPException(status_code=500, detail="Redis is required to generate report by ID (to fetch state)")
        
    # Scanning all analysis keys to find the matching ID (O(N) operation)
    # In a real app, you would save it in postgres with the ID.
    cursor = 0
    found_analysis = None
    
    while True:
        cursor, keys = await cache.redis_client.scan(cursor, match="analysis:*")
        for key in keys:
            data = await cache.get(key)
            if data and data.get("id") == request.analysis_id:
                found_analysis = data
                break
        if cursor == 0 or found_analysis is not None:
            break
            
    if not found_analysis:
        raise HTTPException(status_code=404, detail="Analysis not found or expired from cache")
        
    analysis = AnalysisResponse(**found_analysis)
    return report_service.generate(analysis)
