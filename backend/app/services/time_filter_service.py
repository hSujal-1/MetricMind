import re


def detect_time_filters(question: str):
    """
    Detect time-based filters from a natural language question.

    Supports:
    - Sales in 2014
    - Profit for 2013
    """

    question = question.lower()

    filters = {}

    years = re.findall(r"\b20\d{2}\b", question)

    if len(years) == 1:
        filters["YEAR"] = int(years[0])

    return filters


def detect_time_comparison(question: str):
    """
    Detect year comparison queries.

    Examples:
    - Compare sales in 2013 and 2014
    - Sales 2012 vs 2013
    """

    question = question.lower()

    years = re.findall(r"\b20\d{2}\b", question)

    if len(years) >= 2:

        return {
            "years": [int(year) for year in years]
        }

    return None