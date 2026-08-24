from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.saving_goal import SavingGoal
from app.schemas.goal import SavingGoalPayload, SavingGoalRead


def _to_read(goal: SavingGoal) -> SavingGoalRead:
    progress = (goal.current_amount / goal.target_amount * Decimal("100")).quantize(Decimal("0.01"))
    return SavingGoalRead(
        id=goal.id,
        name=goal.name,
        target_amount=goal.target_amount,
        current_amount=goal.current_amount,
        target_date=goal.target_date,
        account_id=goal.account_id,
        color=goal.color,
        progress_percentage=progress,
        created_at=goal.created_at,
    )


def list_goals(db: Session) -> list[SavingGoalRead]:
    return [_to_read(goal) for goal in db.scalars(select(SavingGoal).order_by(SavingGoal.created_at.asc())).all()]


def get_goal(db: Session, goal_id: int) -> SavingGoal | None:
    return db.get(SavingGoal, goal_id)


def create_goal(db: Session, payload: SavingGoalPayload) -> SavingGoalRead:
    goal = SavingGoal(**payload.model_dump())
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return _to_read(goal)


def update_goal(db: Session, goal: SavingGoal, payload: SavingGoalPayload) -> SavingGoalRead:
    for key, value in payload.model_dump().items():
        setattr(goal, key, value)
    db.commit()
    db.refresh(goal)
    return _to_read(goal)


def delete_goal(db: Session, goal: SavingGoal) -> None:
    db.delete(goal)
    db.commit()
