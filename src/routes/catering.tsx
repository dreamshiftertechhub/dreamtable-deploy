import { useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatNaira } from "@/lib/format";

export const Route = createFileRoute("/catering")({ component: CateringPage });

const PACKAGES = [
  { name: "The Street", guests: "20–40", price: 185000, copy: "Jollof, grilled chicken, plantain, Chapman." },
  { name: "The Table", guests: "40–80", price: 420000, copy: "Full spread plus a carving station and dessert." },
  { name: "The Night", guests: "Private room", price: 95000, copy: "Twelve seats upstairs. A set menu. Yours for the evening." },
];

function CateringPage() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-xl px-4 py-32 text-center">
          <p className="text-[11px] tracking-label text-brand">Catering</p>
          <h1 className="mt-3 font-display text-5xl">We'll call you today.</h1>
          <p className="mt-4 text-muted">The events desk has your note. Keep your phone close.</p>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-24 md:grid-cols-12 md:px-8 md:pt-32">
        <div className="md:col-span-5">
          <p className="text-[11px] tracking-label text-brand">Catering & private dining</p>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">Feed the room.</h1>
          <p className="mt-4 text-muted">
            Birthdays, board lunches, the long overdue reunion. We cook it here. We send it hot.
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
          className="space-y-4 md:col-span-7"
          onSubmit={(e) => {
            e.preventDefault();
            toast("Request sent to the events desk.");
            setSent(true);
          }}
        >
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
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date" id="c-date">
              <Input id="c-date" type="date" required />
            </Field>
            <Field label="Guests" id="c-guests">
              <Input id="c-guests" type="number" min={8} defaultValue={24} required />
            </Field>
          </div>
          <Field label="What are we cooking for?" id="c-note">
            <Textarea id="c-note" placeholder="Office lunch. Surprise 40th. After-church." />
          </Field>
          <Button type="submit" size="lg">
            Request a quote
          </Button>
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
