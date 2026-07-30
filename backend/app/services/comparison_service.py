from app.services.snowflake_service import get_distinct_values

TABLE_NAME = "GLOBAL_SUPERSTORE"

COMPARISON_COLUMNS = {
    "STATE": None,
    "CATEGORY": None,
    "SEGMENT": None,
    "REGION": None,
    "CITY": None
}


def detect_comparison(question: str):
    """
    Detect comparison values from the question.

    Examples:
    - Compare California and Texas sales
    - Compare Technology and Furniture profit
    """

    question = question.lower()

    for column in COMPARISON_COLUMNS:

        values = get_distinct_values(TABLE_NAME, column)

        matched = []

        for value in values:

            if value.lower() in question:
                matched.append(value)

        if len(matched) >= 2:

            return {
                "dimension": column,
                "values": matched
            }

    return None