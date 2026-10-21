import { cn } from "@/lib/utils";
import type { Fulfillment, OrderStatus } from "@/data/types";

const STEPS: { id: OrderStatus; label: string }[] = [
  { id: "confirmed", label: "Order confirmed" },
  { id: "preparing", label: "Kitchen preparing" },
  { id: "ready", label: "Ready" },
  { id: "out-for-delivery", label: "Rider picked up" },
  { id: "delivered", label: "Delivered" },
];

const FLOW: OrderStatus[] = [
  "new",
  "confirmed",
  "preparing",
  "ready",
  "out-for-delivery",
  "delivered",
];

export function TrackingTimeline({
  status,
  fulfillment,
}: {
  status: OrderStatus;
  fulfillment: Fulfillment;
}) {
  const steps =
    fulfillment === "pickup"
      ? STEPS.filter((s) => s.id !== "out-for-delivery").map((s) =>
          s.id === "delivered" ? { ...s, label: "Picked up" } : s,
        )
      : STEPS;
  const idx = FLOW.indexOf(status);
  return (
    <ol className="space-y-0">
      {steps.map((step, i) => {
        const stepIdx = FLOW.indexOf(step.id);
        const done = idx >= stepIdx && status !== "cancelled";
        const current = step.id === status || (status === "new" && step.id === "confirmed");
        return (
          <li key={step.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "mt-0.5 size-3 rounded-full",
                  done ? "bg-brand" : "bg-line",
                  current && "ring-4 ring-brand/20",
                )}
              />
              {i < steps.length - 1 && (
                <span className={cn("w-px flex-1 min-h-8", done ? "bg-brand" : "bg-line")} />
              )}
            </div>
            <p
              className={cn(
                "pb-8 text-sm",
                current ? "font-semibold text-ink" : done ? "text-ink" : "text-subtle",
              )}
            >
              {step.label}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
