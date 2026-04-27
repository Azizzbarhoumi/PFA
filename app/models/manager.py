from app.core.config import settings
from app.models.bert_model import BERTInferenceEngine
from app.models.cnn_model import CNNInferenceEngine
from app.models.lr_model import LRInferenceEngine
from app.models.svm_model import SVMInferenceEngine
from app.models.groq_model import GroqInferenceEngine
from app.core.logging import get_logger

logger = get_logger(__name__)

class ModelManager:
    """
    Singleton manager to ensure models are loaded only once at application startup.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelManager, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized: return
        self.bert = BERTInferenceEngine(settings.BERT_MODEL_PATH)
        self.cnn = CNNInferenceEngine(
            settings.CNN_MODEL_PATH,
            settings.VECTORIZER_PATH,
            model_name=settings.CNN_MODEL_NAME,
        )
        self.lr = LRInferenceEngine(settings.LR_MODEL_PATH, settings.VECTORIZER_PATH)
        self.svm = SVMInferenceEngine(settings.SVM_MODEL_PATH, settings.VECTORIZER_PATH)
        self.groq = GroqInferenceEngine(settings.GROQ_API_KEY)
        self._initialized = True

    def load_all(self):
        logger.info("Starting model loading sequence...")
        self.bert.load()
        self.cnn.load()
        self.lr.load()
        self.svm.load()
        self.groq.load()
        logger.info("All models loaded (or mocked if artifacts absent).")

    def get_bert(self) -> BERTInferenceEngine:
        return self.bert

    def get_lr(self) -> LRInferenceEngine:
        return self.lr

    def get_svm(self) -> SVMInferenceEngine:
        return self.svm

    def get_cnn(self) -> CNNInferenceEngine:
        return self.cnn

    def get_groq(self) -> GroqInferenceEngine:
        return self.groq

model_manager = ModelManager()
