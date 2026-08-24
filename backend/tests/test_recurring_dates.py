import datetime as dt

from app.services.recurring_service import advance_date


def test_monthly_advance_handles_end_of_month():
    assert advance_date(dt.date(2026, 1, 31), "monthly") == dt.date(2026, 2, 28)
