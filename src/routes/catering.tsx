import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/catering")({ component: Page });
function Page() {
  return <SiteShell><main className="mx-auto max-w-3xl px-4 pb-24 pt-28 md:px-8 md:pt-36">
    <p className="text-[11px] font-semibold tracking-label text-brand">Catering · Coming soon</p>
    <h1 className="mt-4 font-display text-5xl md:text-6xl">Gather around, soon.</h1>
    <p className="mt-6 max-w-xl text-lg text-muted">Our catering packages are concepts, not bookable services. We'll announce availability and confirmed pricing when operations begin.</p>
    <p className="mt-4 text-sm text-muted">Please do not send payment or assume a booking is confirmed through this preview website.</p>
    <Button asChild className="mt-9"><Link to="/menu">Explore sample menu</Link></Button>
  </main></SiteShell>;
}
