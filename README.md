# Fake News Detection Backend

A production-grade, scalable Fastapi backend system for fake news classification.

## Features
- Multi-Model Inference Engine (BERT, Logistic Regression, SVM)
- Model disagreement intelligence for deep analysis
- Input Handlers: Text, URL (scraping), PDF (parsing), Image (OCR via Groq Vision)
- Paragraph-Level Analysis with heatmap data
- Multilingual Support (automatic translation)
- Quiz generation via Groq LLM
- News Feed classification (NewsAPI)
- Shareable report generation

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` to include your `GROQ_API_KEY` and `NEWS_API_KEY`.

3. Provide Pre-trained Models:
   Place pre-trained scikit-learn models (`lr_model.pkl`, `svm_model.pkl`) and the `tfidf_vectorizer.pkl` inside the `ml_models/` directory.

4. Run the API:
   ```bash
   python run.py
   ```

## API Documentation
Once running, the interactive API documentation is available at `http://localhost:8000/docs`.

## Testing
Run the test suite:
```bash
pytest tests/ -v
```
