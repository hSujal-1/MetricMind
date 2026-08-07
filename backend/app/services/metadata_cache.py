from app.services.snowflake_service import (
    get_distinct_values,
    get_latest_year
)

TABLE_NAME = "GLOBAL_SUPERSTORE"

FILTER_COLUMNS = [
    "STATE",
    "CATEGORY",
    "REGION",
    "SEGMENT",
    "CITY"
]

FILTER_CACHE = {}

LATEST_YEAR = None


def load_metadata():
    """
    Load semantic metadata once
    during backend startup.
    """

    global FILTER_CACHE
    global LATEST_YEAR

    print("Loading Semantic Metadata...")

    for column in FILTER_COLUMNS:

        FILTER_CACHE[column] = get_distinct_values(
            TABLE_NAME,
            column
        )

    LATEST_YEAR = get_latest_year()

    print(f"Latest Year : {LATEST_YEAR}")

    print("Metadata Loaded Successfully.")


def get_cached_values(column: str):
    return FILTER_CACHE.get(column, [])


def get_cached_latest_year():
    return LATEST_YEAR