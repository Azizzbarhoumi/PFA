from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from app.schemas.enums import Verdict, DisagreementLevel, InputType

class ModelResult(BaseModel):
    model_name: str
    label: Verdict
    confidence: float
    latency_ms: float

class DisagreementInfo(BaseModel):
    level: DisagreementLevel
    explanation: str
    details: Dict[str, Any] = {}

class AnalysisResponse(BaseModel):
    id: str
    input_type: InputType
    verdict: Verdict
    confidence: float
    model_results: List[ModelResult]
    disagreement: DisagreementInfo
    original_text: str
    translated_text: Optional[str] = None
    language_detected: Optional[str] = None

class ParagraphScore(BaseModel):
    index: int
    text: str
    verdict: Verdict
    confidence: float
    suspicion_score: float

class ParagraphAnalysisResponse(BaseModel):
    paragraphs: List[ParagraphScore]
    overall_verdict: Verdict
    heatmap_data: List[Dict[str, Any]]

class QuizQuestion(BaseModel):
    headline: str
    is_fake: bool
    explanation: str

class QuizResponse(BaseModel):
    session_id: str = "default"
    category: str = "general"
    article_title: str = ""
    article_text: str = ""
    source: str = "News Database"
    model_analysis: Dict[str, Any] = {"verdict": "REAL", "confidence": 0.5}
    questions: List[QuizQuestion] = []

class ArticleFeedItem(BaseModel):
    title: str
    author: str = "Unknown"
    source: str
    url: str
    published_date: str
    preview: str
    prediction: Dict[str, Any] = {"status": "analyzed", "verdict": "REAL", "confidence": 0.5}

class FeedResponse(BaseModel):
    count: int = 0
    articles: List[ArticleFeedItem] = []

class ReportResponse(BaseModel):
    report_id: str
    analysis: AnalysisResponse
    generated_at: str
    summary_html: str

class WordScore(BaseModel):
    word: str
    score: float

class WordHeatmapResponse(BaseModel):
    words: List[WordScore]

class ParagraphAnalysisFullResponse(BaseModel):
    id: str
    verdict: Verdict
    confidence: float
    suspicious_paragraph_count: int
    total_paragraphs: int
    paragraphs: List[Dict[str, Any]] = []
    disagreement: Optional[DisagreementInfo] = None

# Keep the old one too for backwards compatibility
class ParagraphAnalysisResponse(BaseModel):
    paragraphs: List[ParagraphScore]
    overall_verdict: Verdict
    heatmap_data: List[Dict[str, Any]]
