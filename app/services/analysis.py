import asyncio
from concurrent.futures import ThreadPoolExecutor
from typing import List
import uuid

from app.schemas.responses import AnalysisResponse, ModelResult
from app.schemas.enums import InputType, Verdict
from app.models.manager import ModelManager
from app.services.disagreement import DisagreementService
from app.services.translation import TranslationService
from app.core.logging import get_logger

logger = get_logger(__name__)
# Executor for running blocking ML models in async context
thread_pool = ThreadPoolExecutor(max_workers=3)

class AnalysisService:
    def __init__(self, model_manager: ModelManager):
        self.model_manager = model_manager
        self.translation_service = TranslationService()
        self.disagreement_service = DisagreementService()

    async def analyze(self, text: str, input_type: InputType) -> AnalysisResponse:
        analysis_id = str(uuid.uuid4())
        logger.info("starting_analysis", analysis_id=analysis_id, input_type=input_type.value)

        # 1. Translation / Language detection
        original_text, translated_text, lang = self.translation_service.process(text)
        
        # Use translated text if it exists, otherwise original
        inference_text = translated_text if translated_text else original_text

        # 2. Parallel Inference
        loop = asyncio.get_running_loop()
        
        # Dispatch model inference to thread pool so we don't block the event loop
        bert_task = loop.run_in_executor(thread_pool, self.model_manager.get_bert().predict, inference_text)
        lr_task = loop.run_in_executor(thread_pool, self.model_manager.get_lr().predict, inference_text)
        svm_task = loop.run_in_executor(thread_pool, self.model_manager.get_svm().predict, inference_text)

        results: List[ModelResult] = await asyncio.gather(bert_task, lr_task, svm_task)
        
        # 3. Disagreement Intelligence
        disagreement = self.disagreement_service.evaluate(results)
        
        # 4. Final Verdict (BERT Authority)
        # Find BERT result as primary
        bert_result = next((r for r in results if r.model_name == "BERT"), None)
        
        if bert_result:
            final_verdict = bert_result.label
            final_confidence = bert_result.confidence
        else:
            # Fallback if BERT is missing
            fake_votes = sum(1 for r in results if r.label == Verdict.FAKE)
            final_verdict = Verdict.FAKE if fake_votes >= 2 else Verdict.REAL
            final_confidence = sum(r.confidence for r in results) / len(results)

        logger.info("analysis_complete", analysis_id=analysis_id, verdict=final_verdict.value)

        return AnalysisResponse(
            id=analysis_id,
            input_type=input_type,
            verdict=final_verdict,
            confidence=round(final_confidence, 4),
            model_results=results,
            disagreement=disagreement,
            original_text=original_text,
            translated_text=translated_text,
            language_detected=lang
        )
