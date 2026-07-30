GROUP_BY_FIELDS = {
    "state": "STATE",
    "states": "STATE",

    "category": "CATEGORY",
    "categories": "CATEGORY",

    "segment": "SEGMENT",
    "segments": "SEGMENT",

    "city": "CITY",
    "cities": "CITY",

    "region": "REGION",
    "regions": "REGION",

    "ship mode": "SHIP_MODE",
    "ship modes": "SHIP_MODE"
}


def detect_group_by(question: str):
    """
    Detect GROUP BY fields from a natural language question.

    Supports:
    - Sales by state
    - Profit by city
    - Top 10 cities by profit
    - Top 5 states by sales
    - Highest categories by profit
    """

    question = question.lower()

    groups = []

    for keyword, column in GROUP_BY_FIELDS.items():

        # Pattern 1: "by state", "by city"
        if f"by {keyword}" in question:
            groups.append(column)

        # Pattern 2: "Top 10 cities", "Highest states"
        elif keyword in question:
            groups.append(column)

    # Remove duplicates while preserving order
    return list(dict.fromkeys(groups))