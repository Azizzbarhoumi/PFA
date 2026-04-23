import json
import redis.asyncio as redis
from typing import Optional, Any
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

class CacheService:
    def __init__(self):
        self.redis_url = settings.REDIS_URL
        self.redis_client: Optional[redis.Redis] = None
        
        if self.redis_url:
            try:
                self.redis_client = redis.from_url(self.redis_url, decode_responses=True)
                logger.info("Redis cache initialized.")
            except Exception as e:
                logger.error("Failed to initialize Redis fallback to no-cache", error=str(e))
                self.redis_client = None

    async def get(self, key: str) -> Optional[Any]:
        if not self.redis_client:
            return None
        try:
            val = await self.redis_client.get(key)
            if val:
                return json.loads(val)
            return None
        except Exception as e:
            logger.warning("Redis GET failed", key=key, error=str(e))
            return None

    async def set(self, key: str, value: Any, ttl: int = 3600):
        if not self.redis_client:
            return
        try:
            encoded = json.dumps(value)
            await self.redis_client.setex(key, ttl, encoded)
        except Exception as e:
            logger.warning("Redis SET failed", key=key, error=str(e))
