# app/services/orderby_service.py

import re


DESCENDING_KEYWORDS = [
    "highest",
    "top",
    "largest",
    "maximum",
    "max",
    "most",
    "best",
    "strongest",
]


ASCENDING_KEYWORDS = [
    "lowest",
    "bottom",
    "smallest",
    "minimum",
    "min",
    "least",
    "worst",
    "weakest",
]


def detect_order_by(question: str, metrics: list):
    """
    Detect ORDER BY direction from the question.

    Examples:
        Top 5 cities by sales
        Highest category by profit
        Bottom 5 cities by sales
        Lowest region by sales
    """

    question = question.lower().strip()

    if not metrics:
        return None

    metric_name = metrics[0]["metric_name"]

    # ----------------------------------
    # Descending
    # ----------------------------------

    for keyword in DESCENDING_KEYWORDS:

        if re.search(rf"\b{re.escape(keyword)}\b", question):

            return {
                "column": metric_name,
                "direction": "DESC"
            }

    # ----------------------------------
    # Ascending
    # ----------------------------------

    for keyword in ASCENDING_KEYWORDS:

        if re.search(rf"\b{re.escape(keyword)}\b", question):

            return {
                "column": metric_name,
                "direction": "ASC"
            }

    return None