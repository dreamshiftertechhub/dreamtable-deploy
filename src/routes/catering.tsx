import { useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatNaira } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/catering")({ component: CateringPage });

const EVENTS = [
  { id: "wedding", label: "Wedding & traditional" },
  { id: "corporate", label: "Corporate lunch" },
  { id: "birthday", label: "Birthday" },
  { id: "home", label: "Private chef at home" },
  { id: "room", label: "Private dining room" },
] as const;

const SERVICES = [
  { id: "drop", label: "Drop-off" },
  { id: "staffed", label: "Staffed service" },
  { id: "live", label: "Live jollof & suya station" },
] as const;

const PACKAGES = [
  { name: "The Street", guests: "20–40", price: 185000, copy: "Jollof, grilled chicken, plantain, Chapman. Delivered hot." },
  { name: "The House", guests: "At your address", price: 240000, copy: "A chef, two cooks, and a full service in your kitchen." },
  { name: "The Table", guests: "40–80", price: 420000, copy: "Full spread, carving station, dessert, and a floor captain." },
  { name: "The Night", guests: "Private room · 12", price: 95000, copy: "Upstairs at Victoria Island. A set menu. Yours until close." },
];

function CateringPage() {
  const [sent, setSent] = useState(false);
  const [event, setEvent] = useState<(typeof EVENTS)[number]["id"]>("birthday");
  const [service, setService] = useState<(typeof SERVICES)[number]["id"]>("staffed");

  if (sent) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-xl px-4 py-32 text-center">
          <p className="text-[11px] tracking-label text-brand">Events desk</p>
          <h1 className="mt-3 font-display text-5xl">We'll call you today.</h1>
          <p className="mt-4 text-muted">
            The events desk has your note. Keep your phone close — quotes go out the same afternoon.
          </p>
          <Button className="mt-8" onClick={() => setSent(false)}>
            Plan another
          </Button>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-24 md:grid-cols-12 md:px-8 md:pt-32">
        <div className="md:col-span-5">
          <p className="text-[11px] tracking-label text-brand">Cook for an event</p>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">We bring the kitchen to you.</h1>
          <p className="mt-4 text-muted">
            Weddings, board lunches, birthdays, naming ceremonies. Drop-off, staffed service, or a live suya station.
          </p>
          <ul className="mt-10 space-y-6">
            {PACKAGES.map((p) => (
              <li key={p.name} className="border-b border-line pb-5">
                <p className="font-display text-2xl">{p.name}</p>
                <p className="mt-1 text-sm text-muted">
                  {p.guests} · from {formatNaira(p.price)}
                </p>
                <p className="mt-2 text-sm">{p.copy}</p>
              </li>
            ))}
          </ul>
        </div>
        <form
          className="space-y-5 md:col-span-7"
          onSubmit={(e) => {
            e.preventDefault();
            toast("Request sent to the events desk.");
            setSent(true);
          }}
        >
          <fieldset>
            <Label className="mb-2 block">What are we cooking for?</Label>
            <div className="flex flex-wrap gap-2">
              {EVENTS.map((ev) => (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => setEvent(ev.id)}
                  className={cn(
                    "h-10 border px-3 text-[11px] font-semibold tracking-label",
                    event === ev.id ? "border-ink bg-ink text-cream" : "border-line bg-paper",
                  )}
                >
                  {ev.label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <Label className="mb-2 block">How should we serve?</Label>
            <div className="flex flex-wrap gap-2">
              {SERVICES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setService(s.id)}
                  className={cn(
                    "h-10 border px-3 text-[11px] font-semibold tracking-label",
                    service === s.id ? "border-ink bg-ink text-cream" : "border-line bg-paper",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" id="c-name">
              <Input id="c-name" required />
            </Field>
            <Field label="Phone" id="c-phone">
              <Input id="c-phone" type="tel" required />
            </Field>
          </div>
          <Field label="Email" id="c-email">
            <Input id="c-email" type="email" required />
          </Field>
          <Field label="Venue or address" id="c-venue">
            <Input id="c-venue" placeholder="Lekki, VI, or the private room upstairs" required />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date" id="c-date">
              <Input id="c-date" type="date" required />
            </Field>
            <Field label="Guests" id="c-guests">
              <Input id="c-guests" type="number" min={8} defaultValue={24} required />
            </Field>
          </div>
          <Field label="Notes" id="c-note">
            <Textarea id="c-note" placeholder="No pork. Extra plantain. Speeches at 8." />
          </Field>
          <Button type="submit" size="lg">
            Request a quote
          </Button>
          <p className="text-sm text-muted">
            Prefer WhatsApp?{" "}
            <a className="text-brand" href="https://wa.me/2342013301840?text=I%20want%20DreamTable%20to%20cook%20for%20an%20event">
              Message the events desk
            </a>
          </p>
        </form>
      </div>
    </SiteShell>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}
