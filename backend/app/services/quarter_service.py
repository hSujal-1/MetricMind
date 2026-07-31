import re


QUARTER_MAP = {
    "q1": 1,
    "q2": 2,
    "q3": 3,
    "q4": 4,
    "quarter 1": 1,
    "quarter 2": 2,
    "quarter 3": 3,
    "quarter 4": 4,
}


def detect_quarter(question: str):
    """
    Detect quarter references.

    Examples:
    - Q1
    - Q2
    - Quarter 3
    - Quarter 4
    """

    question = question.lower()

    for alias, value in QUARTER_MAP.items():

        pattern = rf"\b{re.escape(alias)}\b"

        if re.search(pattern, question):
            return {
                "QUARTER": value
            }

    return {}