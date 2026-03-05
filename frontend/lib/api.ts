const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/api";

export interface Project {
  id: number;
  title: string;
  created_at: string;
  scenes: Scene[];
}

export interface Scene {
  id: number;
  project_id: number;
  source_section?: string | null;
  summary?: string | null;
  script?: string | null;
  visual_prompt?: string | null;
  image_url?: string | null;
  audio_url?: string | null;
  video_url?: string | null;
  order_index?: number;
  duration_seconds?: number;
}

export async function fetchProjects(userId: string): Promise<Project[]> {
  const res = await fetch(`${BACKEND_BASE}/documents?user_id=${encodeURIComponent(userId)}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to load projects");
  }
  return res.json();
}

export async function uploadDocument(params: {
  title: string;
  content: string;
  userId: string;
}): Promise<Project> {
  const body = new URLSearchParams();
  body.set("title", params.title);
  body.set("content", params.content);
  body.set("user_id", params.userId);

  const res = await fetch(`${BACKEND_BASE}/documents/upload`, {
    method: "POST",
    body,
  });
  if (!res.ok) {
    throw new Error("Failed to upload document");
  }
  return res.json();
}

export async function fetchScenes(projectId: number): Promise<Scene[]> {
  const res = await fetch(`${BACKEND_BASE}/scenes/${projectId}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to load scenes");
  }
  return res.json();
}

export async function updateScene(sceneId: number, patch: Partial<Scene>): Promise<Scene> {
  const res = await fetch(`${BACKEND_BASE}/scenes/${sceneId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    throw new Error("Failed to update scene");
  }
  return res.json();
}

export async function regenerateScene(params: {
  sceneId: number;
  changedFields: string[];
}) {
  const res = await fetch(`${BACKEND_BASE}/scenes/regenerate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      scene_id: params.sceneId,
      changed_fields: params.changedFields,
    }),
  });
  if (!res.ok) {
    throw new Error("Failed to regenerate scene");
  }
  return res.json() as Promise<{ scene: Scene; executed_stages: string[] }>;
}

