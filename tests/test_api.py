import pytest
from app.api.dependencies import get_model_manager

def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "up"

def test_analyze_text_mocked_models(client):
    # By default, tests will use mock models since the 'ml_models' dir isn't mocked specifically,
    # but the load() method falls back to mocked results if files aren't found.
    payload = {"text": "This is a very real sounding breaking news article right here."}
    response = client.post("/api/v1/analyze/text", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert "verdict" in data
    assert "confidence" in data
    assert len(data["model_results"]) == 3
    assert data["disagreement"]["level"] in ["FULL_AGREEMENT", "PARTIAL_DISAGREEMENT", "FULL_DISAGREEMENT"]
