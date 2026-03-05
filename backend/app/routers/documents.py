from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db


router = APIRouter()


@router.get("", response_model=List[schemas.Project])
def list_projects(user_id: str, db: Session = Depends(get_db)):
    """
    List projects for the current user.
    In a real app, user_id should come from auth; here it's passed explicitly.
    """
    projects = db.query(models.Project).filter(models.Project.user_id == user_id).all()
    return projects


@router.post("/upload", response_model=schemas.Project)
def upload_document(
    title: str,
    content: str,
    user_id: str,
    db: Session = Depends(get_db),
):
    """
    Create a project from an uploaded document.
    For the hackathon demo, we create a single summary scene.
    """
    project = models.Project(user_id=user_id, title=title, created_at=datetime.utcnow())
    db.add(project)
    db.flush()

    scene = models.Scene(
        project_id=project.id,
        source_section=content,
        summary=f"Auto summary for: {title}",
        script="This is a placeholder narration script generated from the document.",
        visual_prompt="Cinematic, high contrast visuals representing the main ideas.",
        image_url=None,
        audio_url=None,
        video_url=None,
        order_index=0,
    )
    db.add(scene)
    db.commit()
    db.refresh(project)
    return project

