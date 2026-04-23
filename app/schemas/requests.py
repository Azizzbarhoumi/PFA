from pydantic import BaseModel, HttpUrl, Field

class AnalyzeTextRequest(BaseModel):
    text: str = Field(..., min_length=10, description="The text content to analyze")

class AnalyzeURLRequest(BaseModel):
    url: HttpUrl = Field(..., description="The URL of the article to analyze")

class ParagraphAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=10, description="Long text content to chunk and analyze")

class ReportRequest(BaseModel):
    analysis_id: str = Field(..., description="ID of the analysis for report generation")

class WordHeatmapRequest(BaseModel):
    text: str = Field(..., min_length=1, description="The text content to generate a word heatmap for")
