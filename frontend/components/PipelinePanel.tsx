interface Props {
  executedStages: string[];
  isRegenerating: boolean;
}

const STAGES = [
  { key: "summary", label: "Summary" },
  { key: "script", label: "Script" },
  { key: "visual_prompt", label: "Visual" },
  { key: "image", label: "Image" },
  { key: "audio", label: "Voice" },
  { key: "video", label: "Video" },
];

export function PipelinePanel({ executedStages, isRegenerating }: Props) {
  return (
    <aside className="glass-panel flex h-full flex-col border border-white/10">
      <div className="border-b border-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-text/60">
        Pipeline
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto px-3 py-3 text-[11px]">
        {STAGES.map((stage) => {
          const isActive = executedStages.includes(stage.key);
          return (
            <div
              key={stage.key}
              className="flex items-center justify-between rounded-md border border-white/5 bg-black/40 px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    isActive
                      ? "bg-primary shadow-[0_0_8px_rgba(255,31,61,0.9)]"
                      : "bg-white/12"
                  }`}
                />
                <span className="text-[11px] text-text/85">{stage.label}</span>
              </div>
              <span className="text-[10px] text-text/50">
                {isActive
                  ? isRegenerating
                    ? "Regenerating…"
                    : "Updated"
                  : "Idle"}
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

