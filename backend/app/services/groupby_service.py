GROUP_BY_FIELDS = {
    "state": "STATE",
    "category": "CATEGORY",
    "segment": "SEGMENT",
    "city": "CITY",
    "region": "REGION",
    "ship mode": "SHIP_MODE"
}


def detect_group_by(question: str):
    """
    Detect GROUP BY fields from
    a natural language question.
    """

    question = question.lower()

    groups = []

    for keyword, column in GROUP_BY_FIELDS.items():

        if f"by {keyword}" in question:
            groups.append(column)

    return groups