import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OCCASIONS, type Occasion } from "@/data/types";
import { cn } from "@/lib/utils";
import { useMimi } from "@/store/use-mimi";

export const Route = createFileRoute("/reservations")({ component: ReservationsPage });

function ReservationsPage() {
  const profile = useMimi((s) => s.profile);
  const add = useMimi((s) => s.addReservation);
  const [date, setDate] = useState("2026-10-16");
  const [time, setTime] = useState("19:30");
  const [guests, setGuests] = useState(4);
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [occasion, setOccasion] = useState<Occasion>("dinner");
  const [request, setRequest] = useState("");
  const [done, setDone] = useState<{ id: string; date: string; time: string; guests: number } | null>(null);

  if (done) {
    const pretty = new Date(`${done.date}T${done.time}`).toLocaleString("en-NG", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    const clock = new Date(`${done.date}T${done.time}`).toLocaleTimeString("en-NG", {
      hour: "numeric",
      minute: "2-digit",
    });
    return (
      <SiteShell>
        <div className="mx-auto max-w-xl px-4 py-32 text-center">
          <p className="text-[11px] tracking-label text-brand">Reservation #{done.id}</p>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">Table confirmed</h1>
          <p className="mt-6 text-lg">
            {pretty}
            <br />
            {clock}
            <br />
            {done.guests} guests
          </p>
          <Button className="mt-10" onClick={() => setDone(null)}>
            Make another
          </Button>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-24 md:grid-cols-12 md:px-8 md:pt-32">
        <div className="md:col-span-6">
          <p className="text-[11px] tracking-label text-brand">Reservations</p>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">Your table is waiting.</h1>
          <p className="mt-4 max-w-md text-muted">
            Dinner service from 5:00 PM. We hold the table for 15 minutes.
          </p>
          <img src="/food/hero.jpg" alt="" className="mt-10 hidden aspect-[4/3] object-cover md:block" />
        </div>
        <form
          className="space-y-4 md:col-span-6"
          onSubmit={(e) => {
            e.preventDefault();
            const r = add({ date, time, guests, name, phone, email, occasion, request });
            setDone({ id: r.id, date, time, guests });
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="guests">Number of guests</Label>
            <Input
              id="guests"
              type="number"
              min={1}
              max={16}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rname">Name</Label>
            <Input id="rname" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rphone">Phone</Label>
              <Input id="rphone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remail">Email</Label>
              <Input id="remail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <div>
            <Label className="mb-2 block">Occasion</Label>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setOccasion(o.id)}
                  className={cn(
                    "h-10 px-3 text-[11px] font-semibold tracking-label border",
                    occasion === o.id ? "border-ink bg-ink text-cream" : "border-line",
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="req">Special request</Label>
            <Textarea id="req" value={request} onChange={(e) => setRequest(e.target.value)} />
          </div>
          <Button type="submit" size="lg" className="w-full">
            Reserve table
          </Button>
        </form>
      </div>
    </SiteShell>
  );
}
