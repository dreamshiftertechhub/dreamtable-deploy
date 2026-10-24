/** Payments are disabled until DreamTable has verified business banking and launches. */
export function TransferDetails({ total: _total }: { total?: number }) {
  return <div className="border border-line bg-paper p-5 text-sm">
    <p className="font-semibold text-brand">Payments unavailable</p>
    <p className="mt-2 text-muted">DreamTable is not yet accepting orders or transfers. Do not send money to any account advertised in an earlier preview.</p>
  </div>;
}
