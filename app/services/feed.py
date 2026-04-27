import asyncio
import requests
from fastapi import HTTPException
from app.core.config import settings
from app.schemas.responses import FeedResponse, ArticleFeedItem
from app.schemas.enums import Verdict
from app.models.manager import ModelManager
from app.core.logging import get_logger

logger = get_logger(__name__)

class FeedService:
    def __init__(self, model_manager: ModelManager):
        self.api_key = settings.NEWS_API_KEY
        self.model_manager = model_manager

    async def classify_feed(self, category: str = "general") -> FeedResponse:
        if not self.api_key:
            raise HTTPException(status_code=503, detail="NewsAPI key not configured")
            
        logger.info("fetching_news_feed", category=category)
        
        try:
            if category == "politics":
                # Special case: NewsAPI doesn't have a 'politics' category in top-headlines, 
                # so we use /everything with a query.
                url = f"https://newsapi.org/v2/everything?q=politics&language=en&sortBy=publishedAt&pageSize=20&apiKey={self.api_key}"
            else:
                url = f"https://newsapi.org/v2/top-headlines?country=us&category={category}&apiKey={self.api_key}"
            
            loop = asyncio.get_running_loop()
            response = await loop.run_in_executor(None, requests.get, url)
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Failed to fetch from NewsAPI")
                
            articles = response.json().get("articles", [])[:10]
            
            bert = self.model_manager.get_bert()
            
            tasks = []
            valid_articles = [a for a in articles if a.get("title")]
            
            from app.services.analysis import thread_pool
            for article in valid_articles:
                title = article.get("title")
                tasks.append(loop.run_in_executor(thread_pool, bert.predict, title))
                
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            feed_items = []
            for article, result in zip(valid_articles, results):
                if isinstance(result, Exception):
                    logger.warning("feed_classification_error", title=article.get("title"), error=str(result))
                    continue
                    
                published = article.get("publishedAt", "")
                author = article.get("author") or "Unknown"
                feed_items.append(ArticleFeedItem(
                    title=article.get("title", ""),
                    author=author,
                    source=article.get("source", {}).get("name", "Unknown"),
                    url=article.get("url", ""),
                    published_date=published,
                    preview=article.get("description", "")[:200] if article.get("description") else "",
                    prediction={"status": "analyzed", "verdict": result.label.value, "confidence": result.confidence}
                ))
                
            return FeedResponse(count=len(feed_items), articles=feed_items)
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error("feed_processing_failed", error=str(e))
            raise HTTPException(status_code=500, detail=f"Failed to process feed: {str(e)}")
