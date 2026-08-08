# app/services/superlative_service.py

import re


HIGHEST_WORDS = [
    "highest",
    "largest",
    "maximum",
    "max",
    "most",
    "best",
    "top",
    "strongest"
]


LOWEST_WORDS = [
    "lowest",
    "smallest",
    "minimum",
    "min",
    "least",
    "worst",
    "bottom",
    "weakest",
]


def detect_superlative(question: str):
    """
    Detect single-result ranking intent.

    Examples:
        Which category had the highest profit?
        Which region had the lowest sales?
        What is our strongest region?
        What is the best category?
    """

    question = question.lower().strip()

    # ----------------------------------
    # Highest
    # ----------------------------------

    for word in HIGHEST_WORDS:

        if re.search(rf"\b{re.escape(word)}\b", question):

            return {
                "direction": "DESC",
                "limit": 1
            }

    # ----------------------------------
    # Lowest
    # ----------------------------------

    for word in LOWEST_WORDS:

        if re.search(rf"\b{re.escape(word)}\b", question):

            return {
                "direction": "ASC",
                "limit": 1
            }

    return None