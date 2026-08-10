# app/services/groupby_service.py

import re


# ============================================================
# GROUP BY FIELDS
# ============================================================

GROUP_BY_FIELDS = {

    # --------------------------------------------------------
    # Geographic dimensions
    # --------------------------------------------------------

    "state": "STATE",
    "states": "STATE",

    "city": "CITY",
    "cities": "CITY",

    "region": "REGION",
    "regions": "REGION",

    # --------------------------------------------------------
    # Product dimensions
    # --------------------------------------------------------

    "category": "CATEGORY",
    "categories": "CATEGORY",

    "sub-category": "SUB_CATEGORY",
    "sub-categories": "SUB_CATEGORY",

    "subcategory": "SUB_CATEGORY",
    "subcategories": "SUB_CATEGORY",

    # --------------------------------------------------------
    # Customer dimensions
    # --------------------------------------------------------

    "segment": "SEGMENT",
    "segments": "SEGMENT",

    # --------------------------------------------------------
    # Shipping dimensions
    # --------------------------------------------------------

    "ship mode": "SHIP_MODE",
    "ship modes": "SHIP_MODE",

    # --------------------------------------------------------
    # Time dimensions
    # --------------------------------------------------------

    "year": "YEAR",
    "years": "YEAR",

    "quarter": "QUARTER",
    "quarters": "QUARTER",

    "month": "MONTH",
    "months": "MONTH",

    "monthly": "MONTH",

    "yearly": "YEAR",

    "quarterly": "QUARTER",
}


# ============================================================
# DETECT GROUP BY
# ============================================================

def detect_group_by(question: str):
    """
    Detect the dimension that the user wants
    to group business metrics by.

    Examples:

        Sales by category
        Sales by region
        Profit by city
        Sales by month
        Monthly sales
        Sales per quarter
        Top 5 cities by sales
        Highest region by profit
    """

    question = question.lower().strip()

    groups = []

    # ========================================================
    # PATTERN 1
    # "sales by category"
    # "profit by region"
    # "sales by month"
    # ========================================================

    for keyword, column in GROUP_BY_FIELDS.items():

        pattern = rf"\bby\s+{re.escape(keyword)}\b"

        if re.search(pattern, question):
            groups.append(column)

    # ========================================================
    # PATTERN 2
    # "sales per category"
    # "profit per region"
    # "sales per month"
    # ========================================================

    for keyword, column in GROUP_BY_FIELDS.items():

        pattern = rf"\bper\s+{re.escape(keyword)}\b"

        if re.search(pattern, question):
            groups.append(column)

    # ========================================================
    # PATTERN 3
    # DIRECT TIME PHRASES
    #
    # "monthly sales"
    # "monthly profit"
    # "yearly sales"
    # "quarterly sales"
    # ========================================================

    direct_time_patterns = {

        "monthly": "MONTH",
        "month-wise": "MONTH",
        "monthwise": "MONTH",

        "yearly": "YEAR",
        "year-wise": "YEAR",
        "yearwise": "YEAR",

        "quarterly": "QUARTER",
        "quarter-wise": "QUARTER",
        "quarterwise": "QUARTER",
    }

    for keyword, column in direct_time_patterns.items():

        pattern = rf"\b{re.escape(keyword)}\b"

        if re.search(pattern, question):
            groups.append(column)

    # ========================================================
    # PATTERN 4
    # RANKING QUESTIONS
    #
    # "top 5 cities"
    # "bottom 5 categories"
    # "highest region"
    # "lowest city"
    # "best category"
    # ========================================================

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
        re.search(
            rf"\b{re.escape(word)}\b",
            question
        )
        for word in ranking_words
    )

    if has_ranking_intent:

        for keyword, column in GROUP_BY_FIELDS.items():

            pattern = rf"\b{re.escape(keyword)}\b"

            if re.search(pattern, question):
                groups.append(column)

    # ========================================================
    # PATTERN 5
    # TIME PHRASES
    #
    # "sales over months"
    # "sales across months"
    # "sales over years"
    # "sales across quarters"
    # ========================================================

    time_phrases = {

        "over month": "MONTH",
        "over months": "MONTH",

        "across month": "MONTH",
        "across months": "MONTH",

        "over year": "YEAR",
        "over years": "YEAR",

        "across year": "YEAR",
        "across years": "YEAR",

        "over quarter": "QUARTER",
        "over quarters": "QUARTER",

        "across quarter": "QUARTER",
        "across quarters": "QUARTER",
    }

    for phrase, column in time_phrases.items():

        if phrase in question:
            groups.append(column)

    # ========================================================
    # REMOVE DUPLICATES
    # ========================================================

    return list(
        dict.fromkeys(groups)
    )