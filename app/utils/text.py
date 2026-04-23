import re

def chunk_text(text: str, chunk_size: int = 100) -> list[str]:
    """
    Chunks text into paragraphs based on sentence boundaries.
    """
    # Split on sentence endings: . ! ?
    sentences = re.split(r'(?<=[.!?])\s+', text)
    
    chunks = []
    current = []
    count = 0
    
    for sent in sentences:
        sent = sent.strip()
        if not sent:
            continue
        words = len(sent.split())
        if count + words > chunk_size and current:
            chunks.append(". ".join(current) + ".")
            current = [sent]
            count = words
        else:
            current.append(sent)
            count += words
    
    if current:
        # Add period if missing
        last = current[-1]
        if last and not last.endswith(('.', '!', '?')):
            current[-1] = last + "."
        chunks.append(". ".join(current))
        
    return chunks if chunks else [text]

def clean_text(text: str) -> str:
    """Basic text cleaning: remove extra whitespace."""
    return re.sub(r'\s+', ' ', text).strip()
