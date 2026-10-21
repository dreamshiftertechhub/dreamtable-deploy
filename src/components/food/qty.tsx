import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function Qty({
  value,
  onChange,
  className,
}: {
  value: number;
  onChange: (n: number) => void;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex h-11 items-center border border-line bg-paper", className)}>
      <button
        type="button"
        className="grid size-11 place-items-center text-ink hover:bg-surface"
        onClick={() => onChange(Math.max(1, value - 1))}
        aria-label="Decrease quantity"
      >
        <Minus className="size-3.5" />
      </button>
      <span className="min-w-8 text-center text-sm tabular-nums">{value}</span>
      <button
        type="button"
        className="grid size-11 place-items-center text-ink hover:bg-surface"
        onClick={() => onChange(value + 1)}
        aria-label="Increase quantity"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
