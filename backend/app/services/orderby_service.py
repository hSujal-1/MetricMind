ORDER_KEYWORDS = [
    "highest",
    "top",
    "descending",
    "largest",
    "maximum",
    "max"
]

ASCENDING_KEYWORDS = [
    "lowest",
    "ascending",
    "minimum",
    "min",
    "smallest"
]


def detect_order_by(question: str, metrics: list):
    """
    Detect ORDER BY direction from the question.
    """

    question = question.lower()

    if not metrics:
        return None

    metric_name = metrics[0]["metric_name"]

    for keyword in ORDER_KEYWORDS:
        if keyword in question:
            return {
                "column": metric_name,
                "direction": "DESC"
            }

    for keyword in ASCENDING_KEYWORDS:
        if keyword in question:
            return {
                "column": metric_name,
                "direction": "ASC"
            }

    return None