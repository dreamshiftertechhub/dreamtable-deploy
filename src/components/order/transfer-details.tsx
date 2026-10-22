import { useState } from "react";
import { formatNaira } from "@/lib/format";

export const TRANSFER = {
  bank: "Moniepoint",
  name: "Dreamtable",
  number: "9015828778",
} as const;

export function TransferDetails({ total }: { total?: number }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="border border-line bg-paper p-5 text-sm">
      <p className="text-[11px] tracking-label text-brand">Bank transfer</p>
      <dl className="mt-4 space-y-2">
        <Row label="Bank" value={TRANSFER.bank} />
        <Row label="Account name" value={TRANSFER.name} />
        <Row label="Account number" value={TRANSFER.number} strong />
      </dl>
      {typeof total === "number" && (
        <p className="mt-4 font-medium">Send {formatNaira(total)}</p>
      )}
      <button
        type="button"
        className="mt-4 text-[11px] font-semibold tracking-label text-brand"
        onClick={() => {
          void navigator.clipboard?.writeText(TRANSFER.number).then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
          });
        }}
      >
        {copied ? "Copied" : "Copy account number"}
      </button>
      <p className="mt-3 text-muted">
        Use the name on your order as the transfer narration. The kitchen starts the ticket once the payment shows.
      </p>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className={strong ? "font-semibold tabular-nums" : "tabular-nums"}>{value}</dd>
    </div>
  );
}
