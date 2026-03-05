from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from .database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)
    title = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    scenes = relationship("Scene", back_populates="project", cascade="all, delete-orphan")


class Scene(Base):
    __tablename__ = "scenes"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False, index=True)

    source_section = Column(Text)
    summary = Column(Text)
    script = Column(Text)
    visual_prompt = Column(Text)
    image_url = Column(String)
    audio_url = Column(String)
    video_url = Column(String)

    order_index = Column(Integer, default=0)
    duration_seconds = Column(Integer, default=8)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    project = relationship("Project", back_populates="scenes")
    versions = relationship(
        "SceneVersion", back_populates="scene", cascade="all, delete-orphan"
    )


class SceneVersion(Base):
    __tablename__ = "scene_versions"

    id = Column(Integer, primary_key=True, index=True)
    scene_id = Column(Integer, ForeignKey("scenes.id"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    source_section = Column(Text)
    summary = Column(Text)
    script = Column(Text)
    visual_prompt = Column(Text)
    image_url = Column(String)
    audio_url = Column(String)
    video_url = Column(String)

    scene = relationship("Scene", back_populates="versions")

