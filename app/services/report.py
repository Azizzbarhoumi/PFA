import uuid
import datetime
from app.schemas.responses import AnalysisResponse, ReportResponse
from app.core.logging import get_logger

logger = get_logger(__name__)

class ReportService:
    def generate(self, analysis: AnalysisResponse) -> ReportResponse:
        logger.info("generating_report", analysis_id=analysis.id)
        
        report_id = f"rpt_{uuid.uuid4().hex[:8]}"
        timestamp = datetime.datetime.utcnow().isoformat() + "Z"
        
        # Build a basic HTML summary snippet
        color = "#e53e3e" if analysis.verdict == "FAKE" else "#38a169"
        
        html = f"""
        <div class='report-container' style='font-family: sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 8px;'>
            <h2>Fake News Analysis Report</h2>
            <p><strong>Report ID:</strong> {report_id}</p>
            <p><strong>Generated At:</strong> {timestamp}</p>
            <hr/>
            <h3 style='color: {color};'>Final Verdict: {analysis.verdict} ({round(analysis.confidence * 100, 1)}%)</h3>
            
            <h4>Model Breakdown:</h4>
            <ul>
        """
        
        for mr in analysis.model_results:
            html += f"<li>{mr.model_name}: <strong>{mr.label}</strong> ({round(mr.confidence * 100, 1)}%) - <em>{mr.latency_ms}ms</em></li>"
            
        html += f"""
            </ul>
            
            <h4>Disagreement Intelligence:</h4>
            <p><strong>Status:</strong> {analysis.disagreement.level}</p>
            <p>{analysis.disagreement.explanation}</p>
            
            <hr/>
            <h4>Analyzed Content:</h4>
            <p style='background-color: #f7fafc; padding: 10px; border-radius: 4px; font-size: 0.9em; color: #4a5568;'>
                {analysis.original_text[:500]}{'...' if len(analysis.original_text) > 500 else ''}
            </p>
        </div>
        """
        
        return ReportResponse(
            report_id=report_id,
            analysis=analysis,
            generated_at=timestamp,
            summary_html=html
        )
