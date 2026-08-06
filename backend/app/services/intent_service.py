"""
Intent Detection Service

Determines whether a question
is related to business analytics.
"""

BUSINESS_KEYWORDS = [
    "sales",
    "profit",
    "orders",
    "city",
    "state",
    "category",
    "region",
    "segment",
    "customer",
    "product",
    "year",
    "quarter",
    "month",
    "week",
    "top",
    "highest",
    "lowest",
    "best",
    "worst",
    "show",
    "compare",
    "total",
    "revenue",
    "earnings"
]


def is_business_question(question: str):
    """
    Returns True if the question
    appears to be a business analytics query.
    """

    question = question.lower()

    return any(keyword in question for keyword in BUSINESS_KEYWORDS)