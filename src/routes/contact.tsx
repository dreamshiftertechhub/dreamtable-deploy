import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { KITCHEN_CLOSES, RESTAURANT_ADDRESS, RESTAURANT_PHONE } from "@/data/types";

export const Route = createFileRoute("/contact")({ component: ContactPage });

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <SiteShell>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-24 md:grid-cols-12 md:px-8 md:pt-32">
        <div className="md:col-span-5">
          <p className="text-[11px] tracking-label text-brand">Visit</p>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">Come through.</h1>
          <p className="mt-6 text-lg">{RESTAURANT_ADDRESS}</p>
          <p className="mt-2">
            <a className="text-brand" href={`tel:${RESTAURANT_PHONE.replace(/\s/g, "")}`}>
              {RESTAURANT_PHONE}
            </a>
          </p>
          <p className="mt-2 text-muted">hello@dreamtable.ng</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://wa.me/2342013301840"
              className="inline-flex h-11 items-center bg-brand px-5 text-[11px] font-semibold tracking-label text-white"
            >
              WhatsApp
            </a>
            <a
              href="https://www.google.com/maps/search/?api=1&query=14+Adeola+Odeku+Street+Victoria+Island+Lagos"
              className="inline-flex h-11 items-center border border-ink px-5 text-[11px] font-semibold tracking-label"
            >
              Directions
            </a>
          </div>
          <dl className="mt-10 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-line pb-3">
              <dt className="text-muted">Lunch</dt>
              <dd>11:30 AM – 3:30 PM</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-line pb-3">
              <dt className="text-muted">Dinner</dt>
              <dd>5:00 PM – {KITCHEN_CLOSES}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-line pb-3">
              <dt className="text-muted">Delivery</dt>
              <dd>VI, Ikoyi, Lekki</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-line pb-3">
              <dt className="text-muted">Parking</dt>
              <dd>Street + Wings lot</dd>
            </div>
          </dl>
        </div>
        <form
          className="space-y-4 md:col-span-7"
          onSubmit={(e) => {
            e.preventDefault();
            toast("Message received. We'll write back.");
            setSent(true);
          }}
        >
          {sent ? (
            <p className="font-display text-4xl">We've got it.</p>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="n">Name</Label>
                  <Input id="n" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="e">Email</Label>
                  <Input id="e" type="email" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="m">Message</Label>
                <Textarea id="m" required placeholder="A table for Thursday. A question about suya." />
              </div>
              <Button type="submit" size="lg">
                Send
              </Button>
            </>
          )}
        </form>
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-16 md:px-8">
        <iframe
          title="DreamTable on the map"
          className="h-72 w-full border-0 grayscale"
          src="https://www.openstreetmap.org/export/embed.html?bbox=3.415%2C6.422%2C3.435%2C6.436&layer=mapnik&marker=6.4284%2C3.4241"
        />
        <p className="mt-3 text-sm text-muted">14 Adeola Odeku Street, Victoria Island.</p>
      </div>
    </SiteShell>
  );
}
