import type { Scene } from "@/lib/api";

interface Props {
  scenes: Scene[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function SceneSidebar({ scenes, selectedId, onSelect }: Props) {
  return (
    <aside className="glass-panel flex h-full flex-col border border-white/10">
      <div className="border-b border-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-text/60">
        Scenes
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 text-[11px]">
        {scenes.length === 0 && (
          <p className="px-2 py-2 text-text/55">
            No scenes yet. Create a project from the dashboard.
          </p>
        )}
        {scenes.map((scene, idx) => {
          const isActive = scene.id === selectedId;
          return (
            <button
              key={scene.id}
              onClick={() => onSelect(scene.id)}
              className={`w-full rounded-md px-2 py-1.5 text-left transition-colors ${
                isActive
                  ? "bg-primary/15 border border-primary/60 text-text"
                  : "border border-transparent hover:border-white/10 hover:bg-white/5 text-text/80"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase tracking-[0.18em] text-text/50">
                  Scene {idx + 1}
                </span>
                {scene.duration_seconds != null && (
                  <span className="text-[10px] text-text/55">
                    {scene.duration_seconds}s
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-[11px] line-clamp-2 text-text/80">
                {scene.summary || scene.source_section?.slice(0, 60) || "Untitled"}
              </p>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

