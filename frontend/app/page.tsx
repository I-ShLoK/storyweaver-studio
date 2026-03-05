import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-12">
        <section className="grid gap-10 md:grid-cols-[3fr,2fr] items-center">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.28em] text-primary">
              AI Video Creation
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold text-text leading-tight">
              StoryWeaver Studio
            </h1>
            <p className="text-sm text-text/70 max-w-xl">
              Turn research papers, lecture notes, scripts, and reports into cinematic video scenes.
              Edit any stage of the pipeline and regenerate only what changed — script, visuals,
              voice, or final video.
            </p>
            <div className="flex gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-full bg-primary px-5 py-2 text-xs font-semibold tracking-wide text-black shadow-lg shadow-primary/40 hover:bg-accent transition-colors"
              >
                Open Studio
              </Link>
              <a
                href="#pipeline"
                className="inline-flex items-center rounded-full border border-white/10 px-5 py-2 text-xs font-medium text-text/80 hover:border-primary/60 hover:text-primary transition-colors"
              >
                View Pipeline
              </a>
            </div>
            <div className="mt-6 grid gap-4 text-xs text-text/70 md:grid-cols-2">
              <div className="glass-panel p-4">
                <h3 className="text-xs font-semibold text-text mb-1">
                  Modular AI pipeline
                </h3>
                <p className="text-[11px] text-text/70">
                  Each stage — parser, planner, script, visual, voice, video — can be inspected,
                  edited, and selectively regenerated.
                </p>
              </div>
              <div className="glass-panel p-4">
                <h3 className="text-xs font-semibold text-text mb-1">
                  Human in the loop
                </h3>
                <p className="text-[11px] text-text/70">
                  Update a line of narration or tweak a visual prompt; only dependent stages are
                  recomputed.
                </p>
              </div>
            </div>
          </div>
          <div
            id="pipeline"
            className="glass-panel relative overflow-hidden p-5 md:p-6"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <p className="text-[10px] font-semibold tracking-[0.26em] uppercase text-text/50 mb-4">
              Pipeline
            </p>
            <ol className="relative space-y-3 text-xs">
              {[
                "Document",
                "Parser",
                "Planner",
                "Script",
                "Visual",
                "Voice",
                "Video",
              ].map((stage, idx) => (
                <li key={stage} className="flex items-center gap-3">
                  <div className="relative flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black/60 shadow-md shadow-black/60">
                    <span className="text-[10px] text-text/70">{idx + 1}</span>
                    {idx < 6 && (
                      <span className="absolute left-1/2 top-full h-3 w-px -translate-x-1/2 bg-gradient-to-b from-primary/40 via-white/5 to-transparent" />
                    )}
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-text">{stage}</div>
                    <div className="text-[10px] text-text/55">
                      {stage === "Document" && "Upload notes, scripts, or reports."}
                      {stage === "Parser" && "Segment content into coherent sections."}
                      {stage === "Planner" && "Convert sections into ordered scenes."}
                      {stage === "Script" &&
                        "Generate narration drafts for each scene."}
                      {stage === "Visual" &&
                        "Craft cinematic prompts for image generation."}
                      {stage === "Voice" &&
                        "Synthesize narration with AI voices."}
                      {stage === "Video" &&
                        "Compose final clips on a scene timeline."}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
    </div>
  );
}

