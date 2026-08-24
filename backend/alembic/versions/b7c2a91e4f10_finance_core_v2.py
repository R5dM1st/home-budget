"""finance core v2

Revision ID: b7c2a91e4f10
Revises: 68bfd194d3d6
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "b7c2a91e4f10"
down_revision: Union[str, Sequence[str], None] = "68bfd194d3d6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column("monthly_budgets", "amount", existing_type=sa.Numeric(12, 2), type_=sa.Numeric(14, 2), existing_nullable=False)

    # V2 replaces the MVP-only expenses table. This migration is intended for
    # a project that still contains demo data only. See MIGRATION_GUIDE.md.
    op.drop_index("ix_expenses_date", table_name="expenses")
    op.drop_index("ix_expenses_category", table_name="expenses")
    op.drop_table("expenses")

    op.create_table(
        "accounts",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("type", sa.String(length=20), nullable=False),
        sa.Column("currency", sa.String(length=3), nullable=False),
        sa.Column("opening_balance", sa.Numeric(14, 2), nullable=False),
        sa.Column("color", sa.String(length=20), nullable=False),
        sa.Column("is_archived", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_accounts_type", "accounts", ["type"])

    op.create_table(
        "categories",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=80), nullable=False),
        sa.Column("type", sa.String(length=10), nullable=False),
        sa.Column("icon", sa.String(length=40), nullable=False),
        sa.Column("color", sa.String(length=20), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name", "type", name="uq_categories_name_type"),
    )
    op.create_index("ix_categories_type", "categories", ["type"])

    op.create_table(
        "transactions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("description", sa.String(length=255), nullable=False),
        sa.Column("type", sa.String(length=10), nullable=False),
        sa.Column("amount", sa.Numeric(14, 2), nullable=False),
        sa.Column("source_account_id", sa.Integer(), nullable=True),
        sa.Column("destination_account_id", sa.Integer(), nullable=True),
        sa.Column("category_id", sa.Integer(), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint("amount > 0", name="ck_transactions_amount_positive"),
        sa.CheckConstraint(
            "source_account_id IS NULL OR destination_account_id IS NULL OR source_account_id <> destination_account_id",
            name="ck_transactions_distinct_accounts",
        ),
        sa.ForeignKeyConstraint(["source_account_id"], ["accounts.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["destination_account_id"], ["accounts.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["category_id"], ["categories.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    for index_name, column in (
        ("ix_transactions_date", "date"),
        ("ix_transactions_type", "type"),
        ("ix_transactions_source_account_id", "source_account_id"),
        ("ix_transactions_destination_account_id", "destination_account_id"),
        ("ix_transactions_category_id", "category_id"),
    ):
        op.create_index(index_name, "transactions", [column])

    op.create_table(
        "budget_limits",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("year", sa.Integer(), nullable=False),
        sa.Column("month", sa.Integer(), nullable=False),
        sa.Column("category_id", sa.Integer(), nullable=False),
        sa.Column("amount", sa.Numeric(14, 2), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint("amount >= 0", name="ck_budget_limits_amount_non_negative"),
        sa.CheckConstraint("month >= 1 AND month <= 12", name="ck_budget_limits_month_range"),
        sa.ForeignKeyConstraint(["category_id"], ["categories.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("year", "month", "category_id", name="uq_budget_limits_period_category"),
    )
    op.create_index("ix_budget_limits_year", "budget_limits", ["year"])
    op.create_index("ix_budget_limits_month", "budget_limits", ["month"])
    op.create_index("ix_budget_limits_category_id", "budget_limits", ["category_id"])

    op.create_table(
        "recurring_transactions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("description", sa.String(length=255), nullable=False),
        sa.Column("type", sa.String(length=10), nullable=False),
        sa.Column("amount", sa.Numeric(14, 2), nullable=False),
        sa.Column("frequency", sa.String(length=20), nullable=False),
        sa.Column("next_date", sa.Date(), nullable=False),
        sa.Column("source_account_id", sa.Integer(), nullable=True),
        sa.Column("destination_account_id", sa.Integer(), nullable=True),
        sa.Column("category_id", sa.Integer(), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint("amount > 0", name="ck_recurring_amount_positive"),
        sa.ForeignKeyConstraint(["source_account_id"], ["accounts.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["destination_account_id"], ["accounts.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["category_id"], ["categories.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_recurring_transactions_next_date", "recurring_transactions", ["next_date"])

    op.create_table(
        "saving_goals",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("target_amount", sa.Numeric(14, 2), nullable=False),
        sa.Column("current_amount", sa.Numeric(14, 2), nullable=False),
        sa.Column("target_date", sa.Date(), nullable=True),
        sa.Column("account_id", sa.Integer(), nullable=True),
        sa.Column("color", sa.String(length=20), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint("target_amount > 0", name="ck_saving_goals_target_positive"),
        sa.CheckConstraint("current_amount >= 0", name="ck_saving_goals_current_non_negative"),
        sa.ForeignKeyConstraint(["account_id"], ["accounts.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.alter_column("monthly_budgets", "amount", existing_type=sa.Numeric(14, 2), type_=sa.Numeric(12, 2), existing_nullable=False)
    op.drop_table("saving_goals")
    op.drop_index("ix_recurring_transactions_next_date", table_name="recurring_transactions")
    op.drop_table("recurring_transactions")
    op.drop_index("ix_budget_limits_category_id", table_name="budget_limits")
    op.drop_index("ix_budget_limits_month", table_name="budget_limits")
    op.drop_index("ix_budget_limits_year", table_name="budget_limits")
    op.drop_table("budget_limits")
    op.drop_index("ix_transactions_category_id", table_name="transactions")
    op.drop_index("ix_transactions_destination_account_id", table_name="transactions")
    op.drop_index("ix_transactions_source_account_id", table_name="transactions")
    op.drop_index("ix_transactions_type", table_name="transactions")
    op.drop_index("ix_transactions_date", table_name="transactions")
    op.drop_table("transactions")
    op.drop_index("ix_categories_type", table_name="categories")
    op.drop_table("categories")
    op.drop_index("ix_accounts_type", table_name="accounts")
    op.drop_table("accounts")

    op.create_table(
        "expenses",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("description", sa.String(length=255), nullable=False),
        sa.Column("amount", sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column("category", sa.String(length=50), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint("amount > 0", name="ck_expenses_amount_positive"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_expenses_category", "expenses", ["category"])
    op.create_index("ix_expenses_date", "expenses", ["date"])
