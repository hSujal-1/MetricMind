"""
Filter Detection Service

Extracts business filters
from natural language questions.
"""

FILTER_VALUES = {
    "STATE": [
        "California",
        "Texas",
        "New York",
        "Florida"
    ]
}


def detect_filters(question: str):
    """
    Detect filters from user question.

    Returns:
        dict
    """

    question = question.lower()

    filters = {}

    for column, values in FILTER_VALUES.items():

        for value in values:

            if value.lower() in question:
                filters[column] = value

    return filters