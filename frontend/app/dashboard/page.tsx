"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { fetchProjects, uploadDocument, Project } from "@/lib/api";
import { useRouter } from "next/navigation";

const DEMO_USER_ID = "demo-user";

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await fetchProjects(DEMO_USER_ID);
        if (isMounted) setProjects(data);
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const project = await uploadDocument({
        title: title.trim(),
        content: content.trim(),
        userId: DEMO_USER_ID,
      });
      setProjects((prev) => [project, ...prev]);
      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err);
      setError("Failed to create project.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8">
        <section className="grid gap-6 md:grid-cols-[3fr,2fr]">
          <div className="glass-panel p-5">
            <h2 className="text-sm font-semibold text-text mb-3">
              New project
            </h2>
            <p className="text-[11px] text-text/70 mb-4">
              Paste a document or notes and StoryWeaver will turn it into an editable video scene
              sequence.
            </p>
            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="mb-1 block text-[11px] text-text/70">
                  Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-md border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-text placeholder:text-text/40 focus:border-primary/80 focus:outline-none"
                  placeholder="Quantum Computing 101"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-text/70">
                  Document content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="w-full resize-none rounded-md border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-text placeholder:text-text/40 focus:border-primary/80 focus:outline-none"
                  placeholder="Paste lecture notes, research summary, or a script..."
                />
              </div>
              {error && (
                <p className="text-[11px] text-red-400">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-[11px] font-semibold tracking-wide text-black shadow-lg shadow-primary/40 hover:bg-accent transition-colors disabled:opacity-60"
              >
                {loading ? "Creating…" : "Create project"}
              </button>
            </form>
          </div>
          <div className="glass-panel p-5">
            <h2 className="text-sm font-semibold text-text mb-3">
              Your projects
            </h2>
            <div className="space-y-3 text-[11px] text-text/70">
              {projects.length === 0 && (
                <p className="text-text/55">
                  No projects yet. Create one from a document to start weaving.
                </p>
              )}
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => router.push(`/projects/${project.id}`)}
                  className="w-full text-left rounded-md border border-white/10 bg-black/40 px-3 py-2 hover:border-primary/60 hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-text">
                      {project.title}
                    </span>
                    <span className="text-[10px] text-text/55">
                      {new Date(project.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-text/60">
                    {project.scenes?.length ?? 0} scenes
                  </p>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

