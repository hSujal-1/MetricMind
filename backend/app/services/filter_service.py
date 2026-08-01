"""
Filter Detection Service

Extracts business filters
from natural language questions.
"""

import re

from app.services.snowflake_service import get_distinct_values

TABLE_NAME = "GLOBAL_SUPERSTORE"

FILTER_COLUMNS = [
    "STATE",
    "CATEGORY",
    "REGION",
    "SEGMENT",
    "CITY"
]


def detect_filters(question: str):
    """
    Detect business filters dynamically
    from Snowflake.

    Returns:
        dict
    """

    question = question.lower()

    filters = {}

    for column in FILTER_COLUMNS:

        values = get_distinct_values(
            TABLE_NAME,
            column
        )

        for value in values:

            pattern = rf"\b{re.escape(value.lower())}\b"

            if re.search(pattern, question):

                filters[column] = value
                break

    return filters