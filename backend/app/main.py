from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import documents, scenes


app = FastAPI(title="StoryWeaver Studio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


app.include_router(documents.router, prefix="/documents", tags=["documents"])
app.include_router(scenes.router, prefix="/scenes", tags=["scenes"])

