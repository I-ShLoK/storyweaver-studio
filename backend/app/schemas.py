from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class SceneBase(BaseModel):
    source_section: Optional[str] = None
    summary: Optional[str] = None
    script: Optional[str] = None
    visual_prompt: Optional[str] = None
    image_url: Optional[str] = None
    audio_url: Optional[str] = None
    video_url: Optional[str] = None
    order_index: Optional[int] = 0
    duration_seconds: Optional[int] = 8


class SceneCreate(SceneBase):
    project_id: int


class SceneUpdate(SceneBase):
    pass


class Scene(SceneBase):
    id: int
    project_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class SceneVersion(BaseModel):
    id: int
    scene_id: int
    created_at: datetime
    source_section: Optional[str] = None
    summary: Optional[str] = None
    script: Optional[str] = None
    visual_prompt: Optional[str] = None
    image_url: Optional[str] = None
    audio_url: Optional[str] = None
    video_url: Optional[str] = None

    class Config:
        orm_mode = True


class ProjectBase(BaseModel):
    title: str


class ProjectCreate(ProjectBase):
    user_id: str


class Project(ProjectBase):
    id: int
    user_id: str
    created_at: datetime
    scenes: List[Scene] = []

    class Config:
        orm_mode = True


class RegenerationRequest(BaseModel):
    scene_id: int
    changed_fields: List[str]


class RegenerationResult(BaseModel):
    scene: Scene
    executed_stages: List[str]

