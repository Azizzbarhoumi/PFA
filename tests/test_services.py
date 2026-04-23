import pytest
from app.services.disagreement import DisagreementService
from app.schemas.responses import ModelResult
from app.schemas.enums import Verdict, DisagreementLevel

def test_disagreement_full_agreement():
    service = DisagreementService()
    results = [
        ModelResult(model_name="BERT", label=Verdict.FAKE, confidence=0.9, latency_ms=10),
        ModelResult(model_name="LR", label=Verdict.FAKE, confidence=0.8, latency_ms=5),
        ModelResult(model_name="SVM", label=Verdict.FAKE, confidence=0.85, latency_ms=8)
    ]
    info = service.evaluate(results)
    assert info.level == DisagreementLevel.FULL_AGREEMENT

def test_disagreement_partial():
    service = DisagreementService()
    results = [
        ModelResult(model_name="BERT", label=Verdict.FAKE, confidence=0.9, latency_ms=10),
        ModelResult(model_name="LR", label=Verdict.REAL, confidence=0.8, latency_ms=5),
        ModelResult(model_name="SVM", label=Verdict.FAKE, confidence=0.85, latency_ms=8)
    ]
    info = service.evaluate(results)
    assert info.level == DisagreementLevel.PARTIAL_DISAGREEMENT
    assert info.details["fake_count"] == 2
    assert info.details["real_count"] == 1
    assert info.details["bert_override"] == Verdict.FAKE
