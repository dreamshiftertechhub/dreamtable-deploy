import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMimi } from "@/store/use-mimi";

export const Route = createFileRoute("/track/")({ component: TrackIndex });

function TrackIndex() {
  const navigate = useNavigate();
  const latest = useMimi((s) => s.orders[0]?.id ?? "DT2847");
  const [id, setId] = useState(latest);

  return (
    <SiteShell>
      <div className="mx-auto max-w-lg px-4 pb-16 pt-24 md:pt-32">
        <p className="text-[11px] tracking-label text-brand">Tracking</p>
        <h1 className="mt-3 font-display text-5xl">Where's my food?</h1>
        <form
          className="mt-10 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void navigate({
              to: "/track/$orderId",
              params: { orderId: id.replace("#", "").trim() },
            });
          }}
        >
          <Label htmlFor="oid">Order number</Label>
          <Input
            id="oid"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="DT2847"
          />
          <Button type="submit" size="lg">
            Track order
          </Button>
        </form>
      </div>
    </SiteShell>
  );
}
