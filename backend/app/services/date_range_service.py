import re


def detect_date_range(question: str):
    """
    Detect semantic date range queries.

    Examples:
    - between 2012 and 2014
    - from 2012 to 2014
    - after 2013
    - before 2012
    - since 2014
    - until 2015
    """

    question = question.lower()

    # BETWEEN 2012 AND 2014
    match = re.search(
        r"between\s+(20\d{2})\s+and\s+(20\d{2})",
        question
    )

    if match:
        return {
            "operator": "BETWEEN",
            "start": int(match.group(1)),
            "end": int(match.group(2))
        }

    # FROM 2012 TO 2014
    match = re.search(
        r"from\s+(20\d{2})\s+to\s+(20\d{2})",
        question
    )

    if match:
        return {
            "operator": "BETWEEN",
            "start": int(match.group(1)),
            "end": int(match.group(2))
        }

    # AFTER 2013
    match = re.search(
        r"after\s+(20\d{2})",
        question
    )

    if match:
        return {
            "operator": ">",
            "year": int(match.group(1))
        }

    # BEFORE 2012
    match = re.search(
        r"before\s+(20\d{2})",
        question
    )

    if match:
        return {
            "operator": "<",
            "year": int(match.group(1))
        }

    # SINCE 2014
    match = re.search(
        r"since\s+(20\d{2})",
        question
    )

    if match:
        return {
            "operator": ">=",
            "year": int(match.group(1))
        }

    # UNTIL 2015
    match = re.search(
        r"until\s+(20\d{2})",
        question
    )

    if match:
        return {
            "operator": "<=",
            "year": int(match.group(1))
        }

    return None