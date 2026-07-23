"""
Filter Detection Service

Extracts business filters
from natural language questions.
"""
from app.services.snowflake_service import get_distinct_values

FILTER_VALUES = {
    "STATE": {
        "California": [
            "California",
            "CA"
        ],
        "Texas": [
            "Texas",
            "TX"
        ],
        "New York": [
            "New York",
            "NY"
        ],
        "Florida": [
            "Florida",
            "FL"
        ]
    },

    "CATEGORY": {
        "Furniture": [
            "Furniture"
        ],
        "Technology": [
            "Technology",
            "Tech"
        ],
        "Office Supplies": [
            "Office Supplies",
            "Office"
        ]
    }
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

        for actual_value, aliases in values.items():

            for alias in aliases:

                if alias.lower() in question:
                    filters[column] = actual_value
                    break

    return filters