export function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatOrderId(n: number) {
  return `DT${String(n).padStart(4, "0")}`;
}

export function minutesFromNow(iso: string) {
  return Math.max(0, Math.round((new Date(iso).getTime() - Date.now()) / 60000));
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-NG", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
  });
}
