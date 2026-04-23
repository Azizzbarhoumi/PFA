from fastapi import APIRouter, Depends
from app.schemas.responses import FeedResponse
from app.api.dependencies import get_feed_service, get_cache_service
from app.services.feed import FeedService
from app.services.cache import CacheService

router = APIRouter()

@router.get("", response_model=FeedResponse)
async def get_classified_feed_direct(
    feed_service: FeedService = Depends(get_feed_service),
    cache: CacheService = Depends(get_cache_service)
):
    cache_key = "feed:classified_headlines"
    cached_data = await cache.get(cache_key)
    if cached_data:
        return FeedResponse(**cached_data)
        
    result = await feed_service.classify_feed()
    
    await cache.set(cache_key, result.model_dump(mode="json"), ttl=900)
    return result

@router.get("/classify", response_model=FeedResponse)
async def get_classified_feed(
    feed_service: FeedService = Depends(get_feed_service),
    cache: CacheService = Depends(get_cache_service)
):
    cache_key = "feed:classified_headlines"
    cached_data = await cache.get(cache_key)
    if cached_data:
        return FeedResponse(**cached_data)
        
    result = await feed_service.classify_feed()
    
    # Cache feed for 15 minutes
    await cache.set(cache_key, result.model_dump(mode="json"), ttl=900)
    return result
