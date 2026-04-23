from enum import Enum

class InputType(str, Enum):
    TEXT = "text"
    URL = "url"
    PDF = "pdf"
    IMAGE = "image"

class Verdict(str, Enum):
    REAL = "REAL"
    FAKE = "FAKE"

class DisagreementLevel(str, Enum):
    FULL_AGREEMENT = "FULL_AGREEMENT"
    PARTIAL_DISAGREEMENT = "PARTIAL_DISAGREEMENT"
    FULL_DISAGREEMENT = "FULL_DISAGREEMENT"
