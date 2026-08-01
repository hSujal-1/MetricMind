import re


HIGHEST_WORDS = [
    "highest",
    "largest",
    "maximum",
    "max",
    "most",
    "best",
    "top"
]

LOWEST_WORDS = [
    "lowest",
    "smallest",
    "minimum",
    "min",
    "least",
    "worst",
    "bottom"
]


def detect_superlative(question: str):
    """
    Detect highest/lowest intent.

    Examples:
    - highest sales
    - most profitable
    - least profit
    - best performing
    """

    question = question.lower()

    for word in HIGHEST_WORDS:

        if re.search(rf"\b{word}\b", question):

            return {
                "direction": "DESC",
                "limit": 1
            }

    for word in LOWEST_WORDS:

        if re.search(rf"\b{word}\b", question):

            return {
                "direction": "ASC",
                "limit": 1
            }

    return None