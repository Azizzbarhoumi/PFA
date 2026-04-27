from typing import List, Any, Dict
from app.schemas.responses import DisagreementInfo, ModelResult
from app.schemas.enums import DisagreementLevel, Verdict

class DisagreementService:
    @staticmethod
    def evaluate(results: List[ModelResult]) -> DisagreementInfo:
        if not results:
            return DisagreementInfo(
                level=DisagreementLevel.FULL_AGREEMENT,
                explanation="No model results to evaluate."
            )
            
        labels = [r.label for r in results]
        
        all_real = all(l == Verdict.REAL for l in labels)
        all_fake = all(l == Verdict.FAKE for l in labels)
        
        if all_real or all_fake:
            return DisagreementInfo(
                level=DisagreementLevel.FULL_AGREEMENT,
                explanation="All models agree on the verdict.",
                details={"agreed_label": labels[0]}
            )
            
        bert_pred = next((r.label for r in results if r.model_name == "BERT"), None)
        
        fake_count = labels.count(Verdict.FAKE)
        real_count = labels.count(Verdict.REAL)
        
        explanation = f"Models disagree. {fake_count} predicted FAKE, {real_count} predicted REAL."
        if bert_pred:
            explanation += f" BERT (primary authority) predicted {bert_pred.value}."
            
        return DisagreementInfo(
            level=DisagreementLevel.PARTIAL_DISAGREEMENT,
            explanation=explanation,
            details={
                "fake_count": fake_count,
                "real_count": real_count,
                "bert_prediction": bert_pred.value if bert_pred else None
            }
        )
