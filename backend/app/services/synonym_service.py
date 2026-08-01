"""
Business Synonym Service

Maps common business words
to canonical semantic terms.
"""

BUSINESS_SYNONYMS = {

    # Metrics
    "revenue": "sales",
    "income": "sales",
    "turnover": "sales",

    "earnings": "profit",
    "margin": "profit",
    "gain": "profit",

    "purchases": "orders",
    "transactions": "orders",

    # Ranking
    "best": "highest",
    "worst": "lowest",
    "maximum": "highest",
    "minimum": "lowest",

    # Business language
    "performing": "",
    "performance": "",
    "generated": "",
    "generates": "",
    "contributes": "",
    "contribute": "",
    "show": "",
    "display": "",
    "give": ""
}


def normalize_question(question: str):
    """
    Replace business synonyms with
    canonical semantic terms.
    """

    question = question.lower()

    for word, replacement in BUSINESS_SYNONYMS.items():

        question = question.replace(
            word,
            replacement
        )

    return question