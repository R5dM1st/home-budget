import datetime as dt
from decimal import Decimal

import pytest
from pydantic import ValidationError

from app.schemas.transaction import TransactionPayload


def test_expense_requires_source_account():
    with pytest.raises(ValidationError):
        TransactionPayload(
            date=dt.date(2026, 8, 24),
            description="Courses",
            type="expense",
            amount=Decimal("25.00"),
        )


def test_transfer_requires_distinct_accounts():
    with pytest.raises(ValidationError):
        TransactionPayload(
            date=dt.date(2026, 8, 24),
            description="Épargne",
            type="transfer",
            amount=Decimal("100.00"),
            source_account_id=1,
            destination_account_id=1,
        )
