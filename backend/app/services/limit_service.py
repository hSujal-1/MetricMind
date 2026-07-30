import re


def detect_limit(question: str):
    """
    Detects LIMIT value from natural language.
    Examples:
    - Top 5 states
    - Top 10 cities
    - Highest 3 categories
    """

    question = question.lower()

    match = re.search(r"\b(top|highest|lowest)\s+(\d+)\b", question)

    if match:
        return int(match.group(2))

    return None