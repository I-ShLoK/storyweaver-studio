import type { Scene } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";

interface Props {
  scene: Scene | null;
  onChange: (patch: Partial<Scene>, changedFields: string[]) => void;
  onRegenerate: (changedFields: string[]) => Promise<void>;
  saving: boolean;
}

export function SceneEditorPanel({ scene, onChange, onRegenerate, saving }: Props) {
  const [local, setLocal] = useState<Scene | null>(scene);
  const [lastSaved, setLastSaved] = useState<Scene | null>(scene);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    setLocal(scene);
    setLastSaved(scene);
  }, [scene?.id]);

  const dirtyFields = useMemo(() => {
    if (!local || !lastSaved) return [] as string[];
    const fields: (keyof Scene)[] = ["summary", "script", "visual_prompt"];
    const changed: string[] = [];
    for (const field of fields) {
      if (local[field] !== lastSaved[field]) {
        changed.push(field as string);
      }
    }
    return changed;
  }, [local, lastSaved]);

  if (!scene || !local) {
    return (
      <section className="glass-panel flex h-full flex-1 flex-col items-center justify-center border border-white/10 text-[12px] text-text/70">
        Select a scene from the left to edit its summary, script, and visual prompt.
      </section>
    );
  }

  async function handleFieldChange(field: keyof Scene, value: string) {
    const updated = { ...local, [field]: value };
    setLocal(updated);
    onChange({ [field]: value } as Partial<Scene>, [field as string]);
  }

  async function handleRegenerate() {
    if (!dirtyFields.length) {
      await onRegenerate([]);
      return;
    }
    setRegenerating(true);
    try {
      await onRegenerate(dirtyFields);
      setLastSaved(local);
    } finally {
      setRegenerating(false);
    }
  }

  return (
    <section className="glass-panel flex h-full flex-1 flex-col border border-white/10">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-text/60">
            Scene editor
          </p>
          <p className="text-[11px] text-text/70">
            Scene {local.order_index != null ? local.order_index + 1 : ""} •
            &nbsp;
            <span className="text-text/60">
              {dirtyFields.length > 0
                ? `Edited: ${dirtyFields.join(", ")}`
                : "No pending edits"}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-text/55">
            {saving ? "Saving…" : "Saved"}
          </span>
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-[10px] font-semibold tracking-wide text-black shadow-md shadow-primary/40 hover:bg-accent transition-colors disabled:opacity-60"
          >
            {regenerating ? "Regenerating…" : "Regenerate scene"}
          </button>
        </div>
      </div>
      <div className="grid flex-1 grid-rows-[1fr_1fr_1fr] gap-3 p-4 text-[11px]">
        <div className="flex flex-col">
          <label className="mb-1 text-[11px] text-text/70">
            Summary
          </label>
          <textarea
            value={local.summary ?? ""}
            onChange={(e) => handleFieldChange("summary", e.target.value)}
            className="h-full resize-none rounded-md border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-text placeholder:text-text/40 focus:border-primary/80 focus:outline-none"
            placeholder="Short summary of this scene…"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-[11px] text-text/70">
            Script
          </label>
          <textarea
            value={local.script ?? ""}
            onChange={(e) => handleFieldChange("script", e.target.value)}
            className="h-full resize-none rounded-md border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-text placeholder:text-text/40 focus:border-primary/80 focus:outline-none"
            placeholder="Narration script for this scene…"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-[11px] text-text/70">
            Visual prompt
          </label>
          <textarea
            value={local.visual_prompt ?? ""}
            onChange={(e) => handleFieldChange("visual_prompt", e.target.value)}
            className="h-full resize-none rounded-md border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-text placeholder:text-text/40 focus:border-primary/80 focus:outline-none"
            placeholder="Describe the cinematic visual for this scene…"
          />
        </div>
      </div>
    </section>
  );
}

