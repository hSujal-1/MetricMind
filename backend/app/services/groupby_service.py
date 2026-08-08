# app/services/groupby_service.py

import re


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
    "ship modes": "SHIP_MODE",
}


def detect_group_by(question: str):
    """
    Detect the dimension that the user wants
    to group business metrics by.

    Examples:
        Sales by category
        Sales by region
        Profit by city
        Top 5 cities by sales
        Highest category by profit
    """

    question = question.lower().strip()

    groups = []

    # --------------------------------------------------
    # Pattern 1:
    # "sales by category"
    # "profit by region"
    # --------------------------------------------------

    for keyword, column in GROUP_BY_FIELDS.items():

        pattern = rf"\bby\s+{re.escape(keyword)}\b"

        if re.search(pattern, question):
            groups.append(column)

    # --------------------------------------------------
    # Pattern 2:
    # "sales per category"
    # "profit per region"
    # --------------------------------------------------

    for keyword, column in GROUP_BY_FIELDS.items():

        pattern = rf"\bper\s+{re.escape(keyword)}\b"

        if re.search(pattern, question):
            groups.append(column)

    # --------------------------------------------------
    # Pattern 3:
    # ranking questions
    #
    # "top 5 cities"
    # "bottom 5 categories"
    # "highest region"
    # "lowest city"
    # --------------------------------------------------

    ranking_words = [
        "top",
        "bottom",
        "highest",
        "lowest",
        "largest",
        "smallest",
        "best",
        "worst",
        "most",
        "least",
    ]

    has_ranking_intent = any(
        re.search(rf"\b{word}\b", question)
        for word in ranking_words
    )

    if has_ranking_intent:

        for keyword, column in GROUP_BY_FIELDS.items():

            pattern = rf"\b{re.escape(keyword)}\b"

            if re.search(pattern, question):
                groups.append(column)

    # --------------------------------------------------
    # Remove duplicates while preserving order
    # --------------------------------------------------

    return list(dict.fromkeys(groups))