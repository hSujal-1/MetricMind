import re


QUARTER_ALIASES = {
    "q1": 1,
    "q2": 2,
    "q3": 3,
    "q4": 4,
    "quarter 1": 1,
    "quarter 2": 2,
    "quarter 3": 3,
    "quarter 4": 4,
}


def detect_quarter_comparison(question: str):
    """
    Detect quarter comparison queries.

    Examples:
    - Compare Q1 and Q2 sales
    - Compare Quarter 1 and Quarter 4 profit
    """

    question = question.lower()

    matched = []

    for alias, value in QUARTER_ALIASES.items():

        pattern = rf"\b{re.escape(alias)}\b"

        if re.search(pattern, question):

            matched.append(value)

    matched = sorted(set(matched))

    if len(matched) >= 2:

        return {
            "dimension": "QUARTER",
            "values": matched
        }

    return None