import pytest
from app.models.manager import ModelManager
from app.schemas.enums import Verdict

def test_model_manager_fallback_predict():
    # Will fail to load actual models, should fallback
    manager = ModelManager()
    manager.load_all()
    
    bert = manager.get_bert()
    lr = manager.get_lr()
    svm = manager.get_svm()
    
    # Test BERT Mock
    res1 = bert.predict("fake news text")
    assert res1.model_name == "BERT"
    assert "latency_ms" in res1.model_dump()

    # Test LR Mock
    res2 = lr.predict("real text")
    assert res2.model_name == "Logistic Regression"
    
    # Test SVM Mock
    res3 = svm.predict("text")
    assert res3.model_name == "SVM"
