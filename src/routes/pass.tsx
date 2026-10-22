import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { PassBoard } from "@/components/pass/pass-board";

export const Route = createFileRoute("/pass")({ component: PassPage });

function PassPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-24 md:pt-32">
        <p className="text-[11px] tracking-label text-brand">Live from the kitchen</p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">The pass</h1>
        <p className="mt-4 max-w-lg text-muted">
          Whatever the kitchen just called. One tap and it's yours — the same plate, not a photo of yesterday's specials.
        </p>
        <div className="mt-10">
          <PassBoard />
        </div>
      </div>
    </SiteShell>
  );
}
