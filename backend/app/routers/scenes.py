from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..pipeline.regeneration_engine import compute_affected_stages


router = APIRouter()


@router.get("/{project_id}", response_model=List[schemas.Scene])
def get_scenes(project_id: int, db: Session = Depends(get_db)):
    scenes = (
        db.query(models.Scene)
        .filter(models.Scene.project_id == project_id)
        .order_by(models.Scene.order_index.asc())
        .all()
    )
    return scenes


@router.put("/{scene_id}", response_model=schemas.Scene)
def update_scene(
    scene_id: int,
    payload: schemas.SceneUpdate,
    db: Session = Depends(get_db),
):
    scene = db.query(models.Scene).filter(models.Scene.id == scene_id).first()
    if not scene:
        raise HTTPException(status_code=404, detail="Scene not found")

    # Save version snapshot before mutation
    version = models.SceneVersion(
        scene_id=scene.id,
        source_section=scene.source_section,
        summary=scene.summary,
        script=scene.script,
        visual_prompt=scene.visual_prompt,
        image_url=scene.image_url,
        audio_url=scene.audio_url,
        video_url=scene.video_url,
    )
    db.add(version)

    for field, value in payload.dict(exclude_unset=True).items():
        setattr(scene, field, value)

    db.commit()
    db.refresh(scene)
    return scene


@router.post("/regenerate", response_model=schemas.RegenerationResult)
def regenerate_scene(
    request: schemas.RegenerationRequest,
    db: Session = Depends(get_db),
):
    scene = db.query(models.Scene).filter(models.Scene.id == request.scene_id).first()
    if not scene:
        raise HTTPException(status_code=404, detail="Scene not found")

    stages = compute_affected_stages(request.changed_fields)

    # For hackathon demo, we don't run full AI pipeline here;
    # instead, we append a note to regenerated fields to make behavior visible.
    if "summary" in stages and scene.summary:
        scene.summary = scene.summary + " [regenerated]"
    if "script" in stages and scene.script:
        scene.script = scene.script + " [regenerated]"
    if "visual_prompt" in stages and scene.visual_prompt:
        scene.visual_prompt = scene.visual_prompt + " [regenerated]"
    if "image" in stages:
        scene.image_url = scene.image_url or ""
    if "audio" in stages:
        scene.audio_url = scene.audio_url or ""
    if "video" in stages:
        scene.video_url = scene.video_url or ""

    db.commit()
    db.refresh(scene)

    return schemas.RegenerationResult(scene=scene, executed_stages=stages)

