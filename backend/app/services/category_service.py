from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.category import Category
from app.schemas.category import CategoryPayload


DEFAULT_CATEGORIES = [
    ("Logement", "expense", "home", "#6366f1"),
    ("Courses", "expense", "cart", "#16a34a"),
    ("Transport", "expense", "car", "#0ea5e9"),
    ("Factures", "expense", "receipt", "#f59e0b"),
    ("Loisirs", "expense", "sparkles", "#ec4899"),
    ("Abonnements", "expense", "repeat", "#8b5cf6"),
    ("Shopping", "expense", "bag", "#f97316"),
    ("Santé", "expense", "heart", "#ef4444"),
    ("Autre", "expense", "circle", "#64748b"),
    ("Salaire", "income", "wallet", "#16a34a"),
    ("Remboursement", "income", "arrow-down", "#0ea5e9"),
    ("Autre revenu", "income", "plus", "#64748b"),
]


def ensure_default_categories(db: Session) -> None:
    count = db.scalar(select(Category.id).limit(1))
    if count is not None:
        return
    for name, type_, icon, color in DEFAULT_CATEGORIES:
        db.add(Category(name=name, type=type_, icon=icon, color=color))
    db.commit()


def list_categories(db: Session, category_type: str | None = None) -> list[Category]:
    statement = select(Category).order_by(Category.type.asc(), Category.name.asc())
    if category_type:
        statement = statement.where(Category.type == category_type)
    return list(db.scalars(statement).all())


def get_category(db: Session, category_id: int) -> Category | None:
    return db.get(Category, category_id)


def create_category(db: Session, payload: CategoryPayload) -> Category:
    category = Category(**payload.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def update_category(db: Session, category: Category, payload: CategoryPayload) -> Category:
    for key, value in payload.model_dump().items():
        setattr(category, key, value)
    db.commit()
    db.refresh(category)
    return category


def delete_category(db: Session, category: Category) -> None:
    db.delete(category)
    db.commit()
