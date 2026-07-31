import re

from app.services.snowflake_service import get_latest_year


def detect_relative_time(question: str):
    """
    Detect relative year expressions.

    Examples:
    - this year
    - current year
    - last year
    - previous year
    - for this year
    - in current year
    - of last year
    """

    question = question.lower()

    latest_year = get_latest_year()

    current_patterns = [
        r"\bthis\s+year\b",
        r"\bcurrent\s+year\b",
        r"\bfor\s+this\s+year\b",
        r"\bin\s+this\s+year\b",
        r"\bof\s+this\s+year\b",
        r"\bfor\s+current\s+year\b",
        r"\bin\s+current\s+year\b",
    ]

    previous_patterns = [
        r"\blast\s+year\b",
        r"\bprevious\s+year\b",
        r"\bfor\s+last\s+year\b",
        r"\bin\s+last\s+year\b",
        r"\bof\s+last\s+year\b",
        r"\bfor\s+previous\s+year\b",
        r"\bin\s+previous\s+year\b",
    ]

    for pattern in current_patterns:
        if re.search(pattern, question):
            return {
                "YEAR": latest_year
            }

    for pattern in previous_patterns:
        if re.search(pattern, question):
            return {
                "YEAR": latest_year - 1
            }

    return {}