import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({ component: ContactPage });

function ContactPage() {
  return <SiteShell>
    <main className="mx-auto max-w-3xl px-4 pb-24 pt-28 md:px-8 md:pt-36">
      <p className="text-[11px] font-semibold tracking-label text-brand">DreamTable · Pre-launch</p>
      <h1 className="mt-4 font-display text-5xl md:text-6xl">Something delicious is taking shape.</h1>
      <p className="mt-6 max-w-xl text-lg text-muted">We're developing our Nigerian-inspired menu and restaurant experience. Our location, opening hours and official booking details will be announced once confirmed.</p>
      <p className="mt-5 text-sm text-muted">This is a preview website. We are not accepting orders, payments, reservations or catering bookings.</p>
      <Button asChild className="mt-9"><Link to="/menu">Explore our sample menu</Link></Button>
    </main>
  </SiteShell>;
}
