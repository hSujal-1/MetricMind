import re

from app.services.nlp_service import detect_metrics


OPERATORS = {
    "greater than": ">",
    "more than": ">",
    "above": ">",
    "over": ">",

    "less than": "<",
    "below": "<",
    "under": "<",

    "at least": ">=",
    "minimum": ">=",

    "at most": "<=",
    "maximum": "<="
}


def detect_having(question: str):
    """
    Detect aggregate HAVING conditions.

    Examples:
    - Cities with sales above 500000
    - Categories with profit greater than 10000
    """

    question = question.lower()

    metrics = detect_metrics(question)

    if not metrics:
        return None

    metric = metrics[0]["metric_name"]

    for phrase, operator in OPERATORS.items():

        pattern = rf"{phrase}\s+(\d+)"

        match = re.search(pattern, question)

        if match:

            return {
                "metric": metric,
                "operator": operator,
                "value": int(match.group(1))
            }

    return None