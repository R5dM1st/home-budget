import datetime as dt

from app.services.analytics_service import month_bounds


def test_month_bounds_december():
    assert month_bounds(2026, 12) == (dt.date(2026, 12, 1), dt.date(2027, 1, 1))


def test_month_bounds_august():
    assert month_bounds(2026, 8) == (dt.date(2026, 8, 1), dt.date(2026, 9, 1))
