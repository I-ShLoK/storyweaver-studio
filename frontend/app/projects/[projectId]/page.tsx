"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import {
  fetchScenes,
  regenerateScene,
  updateScene,
  type Scene,
} from "@/lib/api";
import { SceneSidebar } from "@/components/SceneSidebar";
import { PipelinePanel } from "@/components/PipelinePanel";
import { SceneEditorPanel } from "@/components/SceneEditorPanel";

export default function ProjectEditorPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [executedStages, setExecutedStages] = useState<string[]>([]);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await fetchScenes(Number(projectId));
        if (!isMounted) return;
        setScenes(data);
        if (data.length > 0) {
          setSelectedId(data[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [projectId]);

  const selectedScene = useMemo(
    () => scenes.find((s) => s.id === selectedId) || null,
    [scenes, selectedId]
  );

  async function handleSceneChange(patch: Partial<Scene>, changedFields: string[]) {
    if (!selectedScene) return;
    setScenes((prev) =>
      prev.map((s) => (s.id === selectedScene.id ? { ...s, ...patch } : s))
    );
    setSaving(true);
    try {
      const updated = await updateScene(selectedScene.id, patch);
      setScenes((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleRegenerate(changedFields: string[]) {
    if (!selectedScene) return;
    setIsRegenerating(true);
    try {
      const result = await regenerateScene({
        sceneId: selectedScene.id,
        changedFields,
      });
      setScenes((prev) =>
        prev.map((s) => (s.id === result.scene.id ? result.scene : s))
      );
      setExecutedStages(result.executed_stages);
      setTimeout(() => setExecutedStages([]), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRegenerating(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6">
        {loading ? (
          <div className="flex flex-1 items-center justify-center text-xs text-text/70">
            Loading project…
          </div>
        ) : (
          <div className="grid h-[calc(100vh-140px)] grid-cols-[240px_minmax(0,1.6fr)_240px] gap-4">
            <SceneSidebar
              scenes={scenes}
              selectedId={selectedId}
              onSelect={(id) => setSelectedId(id)}
            />
            <SceneEditorPanel
              scene={selectedScene}
              onChange={handleSceneChange}
              onRegenerate={handleRegenerate}
              saving={saving}
            />
            <PipelinePanel
              executedStages={executedStages}
              isRegenerating={isRegenerating}
            />
          </div>
        )}
      </main>
    </div>
  );
}

