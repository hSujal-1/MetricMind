from pydantic import BaseModel
from typing import Any


class APIResponse(BaseModel):
    success: bool

    type: str | None = None

    question: str | None = None

    query_plan: dict | None = None

    sql: str | None = None

    data: Any = None

    message: str | None = None