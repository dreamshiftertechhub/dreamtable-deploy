import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/reservations")({ component: Page });
function Page() {
  return <SiteShell><main className="mx-auto max-w-3xl px-4 pb-24 pt-28 md:px-8 md:pt-36">
    <p className="text-[11px] font-semibold tracking-label text-brand">Dine-in at RealMeal</p>
    <h1 className="mt-4 font-display text-5xl md:text-6xl">Visit us in Iyana Ipaja.</h1>
    <p className="mt-6 max-w-xl text-lg text-muted">RealMeal welcomes dine-in guests at 4 Agbele, Iyana Ipaja, Lagos State. Online table reservations are not yet available; a website visit does not confirm a booking.</p>
    <p className="mt-4 text-sm text-muted">Please do not send a reservation payment through this website.</p>
    <Button asChild className="mt-9"><Link to="/menu">Explore menu</Link></Button>
  </main></SiteShell>;
}
