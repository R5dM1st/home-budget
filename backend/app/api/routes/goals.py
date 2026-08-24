from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.schemas.goal import SavingGoalPayload, SavingGoalRead
from app.services import goal_service

router = APIRouter(prefix="/goals", tags=["goals"])


@router.get("", response_model=list[SavingGoalRead])
def list_goals(db: Session = Depends(get_db)):
    return goal_service.list_goals(db)


@router.post("", response_model=SavingGoalRead, status_code=status.HTTP_201_CREATED)
def create_goal(payload: SavingGoalPayload, db: Session = Depends(get_db)):
    return goal_service.create_goal(db, payload)


@router.put("/{goal_id}", response_model=SavingGoalRead)
def update_goal(goal_id: int, payload: SavingGoalPayload, db: Session = Depends(get_db)):
    goal = goal_service.get_goal(db, goal_id)
    if goal is None:
        raise HTTPException(status_code=404, detail="Objectif introuvable")
    return goal_service.update_goal(db, goal, payload)


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(goal_id: int, db: Session = Depends(get_db)):
    goal = goal_service.get_goal(db, goal_id)
    if goal is None:
        raise HTTPException(status_code=404, detail="Objectif introuvable")
    goal_service.delete_goal(db, goal)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
