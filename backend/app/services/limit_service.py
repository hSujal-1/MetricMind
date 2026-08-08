# app/services/limit_service.py

import re


def detect_limit(question: str):
    """
    Detect LIMIT value from natural language.

    Examples:
        Top 5 cities
        Top 10 categories
        Bottom 5 cities
        Highest 3 regions
        Lowest 10 states
    """

    question = question.lower().strip()

    pattern = (
        r"\b"
        r"(top|bottom|highest|lowest)"
        r"\s+"
        r"(\d+)"
        r"\b"
    )

    match = re.search(pattern, question)

    if match:
        return int(match.group(2))

    return None