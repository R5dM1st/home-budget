import datetime as dt
from decimal import Decimal

import pytest
from pydantic import ValidationError

from app.schemas.expense import ExpenseCreate


def test_valid_expense() -> None:
    expense = ExpenseCreate(
        date="2026-08-14",
        description=" Carrefour ",
        amount="72.40",
        category="Courses",
    )

    assert expense.date == dt.date(2026, 8, 14)
    assert expense.description == "Carrefour"
    assert expense.amount == Decimal("72.40")


def test_negative_amount_is_rejected() -> None:
    with pytest.raises(ValidationError):
        ExpenseCreate(
            date="2026-08-14",
            description="Test",
            amount="-1.00",
            category="Courses",
        )
