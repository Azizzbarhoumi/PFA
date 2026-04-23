from typing import Optional
from transformers import AutoTokenizer, BertConfig, BertModel
import torch
from app.schemas.responses import ModelResult
from app.schemas.enums import Verdict
from app.core.logging import get_logger
from app.utils.timing import time_execution

logger = get_logger(__name__)

class BERTInferenceEngine:
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.tokenizer = None
        self.model = None

    def load(self):
        import os
        logger.info(f"Loading BERT model from {self.model_path} onto {self.device}...")
        try:
            local_tokenizer_path = 'ml_models/bert-base-uncased'
            if os.path.exists(local_tokenizer_path):
                self.tokenizer = AutoTokenizer.from_pretrained(local_tokenizer_path)
            else:
                self.tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')
            
            state_dict = torch.load(self.model_path, map_location=self.device, weights_only=False)
            
            bert_model = BertModel.from_pretrained('bert-base-uncased')
            
            filtered_state_dict = {}
            classifier_weight = None
            classifier_bias = None
            
            for key, value in state_dict.items():
                if key.startswith('classifier.'):
                    if key == 'classifier.weight':
                        classifier_weight = value
                    elif key == 'classifier.bias':
                        classifier_bias = value
                elif key.startswith('bert.'):
                    new_key = key.replace('bert.', '')
                    filtered_state_dict[new_key] = value
            
            bert_model.load_state_dict(filtered_state_dict, strict=False)
            bert_model.to(self.device)
            bert_model.eval()
            
            if classifier_weight is not None and classifier_bias is not None:
                self.classifier_weight = classifier_weight.to(self.device)
                self.classifier_bias = classifier_bias.to(self.device)
            else:
                self.classifier_weight = None
                self.classifier_bias = None
            
            self.model = bert_model
            logger.info("BERT model loaded successfully.")
        except Exception as e:
            logger.warning(f"Failed to load BERT model: {e}")
            self.model = None

    def predict(self, text: str) -> ModelResult:
        with time_execution() as timing:
            if not self.model:
                logger.debug("BERT mock prediction - no model loaded")
                latency = timing.get("latency_ms", 100.0)
                return ModelResult(
                    model_name="BERT",
                    label=Verdict.REAL,
                    confidence=0.5,
                    latency_ms=latency
                )

            try:
                inputs = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=512, padding=True)
                input_ids = inputs['input_ids'].to(self.device)
                attention_mask = inputs['attention_mask'].to(self.device)
                
                with torch.no_grad():
                    outputs = self.model(input_ids=input_ids, attention_mask=attention_mask)
                    pooled_output = outputs.pooler_output
                    
                    if self.classifier_weight is not None:
                        logits = torch.matmul(pooled_output, self.classifier_weight.t()) + self.classifier_bias
                    else:
                        logits = self.model.classifier(pooled_output) if hasattr(self.model, 'classifier') else pooled_output
                    
                    probabilities = torch.nn.functional.softmax(logits, dim=-1)
                    confidence, predicted_class_id = torch.max(probabilities, dim=-1)
                
                class_id = predicted_class_id.item()
                label = Verdict.FAKE if class_id == 1 else Verdict.REAL
                conf_val = confidence.item()
                
            except Exception as e:
                logger.warning(f"BERT prediction failed: {e}")
                return ModelResult(
                    model_name="BERT",
                    label=Verdict.REAL,
                    confidence=0.5,
                    latency_ms=timing.get("latency_ms", 100.0)
                )
                
        return ModelResult(
            model_name="BERT",
            label=label,
            confidence=conf_val,
            latency_ms=timing["latency_ms"]
        )