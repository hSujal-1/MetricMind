# app/services/sql_validator.py

import re


# ============================================================
# ALLOWED SQL OPERATIONS
# ============================================================

ALLOWED_STATEMENTS = {
    "SELECT",
    "WITH"
}


# ============================================================
# BLOCKED SQL KEYWORDS
# ============================================================

BLOCKED_KEYWORDS = {
    "INSERT",
    "UPDATE",
    "DELETE",
    "DROP",
    "ALTER",
    "TRUNCATE",
    "MERGE",
    "CREATE",
    "REPLACE",
    "GRANT",
    "REVOKE",
    "CALL",
    "EXECUTE",
    "EXEC",
    "COPY",
    "PUT",
    "GET",
    "REMOVE"
}


def validate_sql(sql: str):
    """
    Validate SQL before sending it to Snowflake.

    MetricMind is intended to generate
    read-only analytical queries.

    Returns:
        {
            "valid": True
        }

    or:

        {
            "valid": False,
            "error": "..."
        }
    """

    # --------------------------------------------------------
    # Basic validation
    # --------------------------------------------------------

    if not sql or not sql.strip():

        return {
            "valid": False,
            "error": "Generated SQL is empty."
        }

    cleaned_sql = sql.strip()

    # --------------------------------------------------------
    # Remove trailing semicolons
    # --------------------------------------------------------

    cleaned_sql = cleaned_sql.rstrip(";").strip()

    # --------------------------------------------------------
    # First SQL statement
    # --------------------------------------------------------

    first_word_match = re.match(
        r"^\s*([A-Za-z]+)",
        cleaned_sql
    )

    if not first_word_match:

        return {
            "valid": False,
            "error": "Unable to identify SQL statement type."
        }

    first_word = first_word_match.group(1).upper()

    # --------------------------------------------------------
    # Only SELECT / WITH queries are allowed
    # --------------------------------------------------------

    if first_word not in ALLOWED_STATEMENTS:

        return {
            "valid": False,
            "error": (
                f"SQL operation '{first_word}' "
                "is not allowed."
            )
        }

    # --------------------------------------------------------
    # Block dangerous SQL keywords
    # --------------------------------------------------------

    for keyword in BLOCKED_KEYWORDS:

        pattern = rf"\b{re.escape(keyword)}\b"

        if re.search(
            pattern,
            cleaned_sql,
            flags=re.IGNORECASE
        ):

            return {
                "valid": False,
                "error": (
                    f"Blocked SQL operation detected: "
                    f"{keyword}"
                )
            }

    # --------------------------------------------------------
    # Block multiple SQL statements
    # --------------------------------------------------------

    if ";" in cleaned_sql:

        return {
            "valid": False,
            "error": "Multiple SQL statements are not allowed."
        }

    # --------------------------------------------------------
    # Block SQL comments
    # --------------------------------------------------------

    if "--" in cleaned_sql:

        return {
            "valid": False,
            "error": "SQL comments are not allowed."
        }

    if "/*" in cleaned_sql or "*/" in cleaned_sql:

        return {
            "valid": False,
            "error": "SQL block comments are not allowed."
        }

    # --------------------------------------------------------
    # Validation successful
    # --------------------------------------------------------

    return {
        "valid": True
    }