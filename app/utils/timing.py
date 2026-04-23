import time
from contextlib import contextmanager

@contextmanager
def time_execution():
    start = time.time()
    result = {"latency_ms": 0.0}
    try:
        yield result
    finally:
        end = time.time()
        result["latency_ms"] = round((end - start) * 1000, 2)
