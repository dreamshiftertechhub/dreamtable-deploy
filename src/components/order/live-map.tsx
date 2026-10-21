import { useEffect, useRef } from "react";
import type { OrderStatus } from "@/data/types";
import "leaflet/dist/leaflet.css";

const KITCHEN: [number, number] = [6.4284, 3.4241];
const DOOR: [number, number] = [6.4474, 3.4723];
const PATH: [number, number][] = [
  KITCHEN,
  [6.4312, 3.4308],
  [6.4358, 3.4412],
  [6.441, 3.456],
  DOOR,
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function along(t: number): [number, number] {
  const clamped = Math.min(1, Math.max(0, t));
  const scaled = clamped * (PATH.length - 1);
  const i = Math.min(PATH.length - 2, Math.floor(scaled));
  const local = scaled - i;
  return [lerp(PATH[i][0], PATH[i + 1][0], local), lerp(PATH[i][1], PATH[i + 1][1], local)];
}

function progressFor(status: OrderStatus) {
  if (status === "delivered") return 1;
  if (status === "out-for-delivery") return null;
  if (status === "ready") return 0.12;
  if (status === "preparing" || status === "confirmed") return 0.02;
  return 0;
}

export function LiveMap({ status }: { status: OrderStatus }) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    let cancelled = false;
    let map: { remove: () => void } | null = null;
    let raf = 0;

    void (async () => {
      const L = await import("leaflet");
      if (cancelled || !el.current) return;

      const instance = L.map(el.current, {
        zoomControl: false,
        attributionControl: true,
        scrollWheelZoom: false,
      }).setView([6.437, 3.448], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19,
      }).addTo(instance);

      const line = L.polyline(PATH, {
        color: "#D71920",
        weight: 3,
        dashArray: "8 8",
        opacity: 0.95,
      }).addTo(instance);

      instance.fitBounds(line.getBounds(), { padding: [28, 28] });

      L.circleMarker(KITCHEN, {
        radius: 8,
        color: "#FFF8F2",
        weight: 2,
        fillColor: "#102A72",
        fillOpacity: 1,
      })
        .addTo(instance)
        .bindTooltip("DreamTable · Victoria Island", { permanent: true, direction: "right", className: "map-tip" });

      L.circleMarker(DOOR, {
        radius: 8,
        color: "#FFF8F2",
        weight: 2,
        fillColor: "#D71920",
        fillOpacity: 1,
      })
        .addTo(instance)
        .bindTooltip("Your door", { permanent: true, direction: "left", className: "map-tip" });

      const rider = L.circleMarker(along(0), {
        radius: 9,
        color: "#111111",
        weight: 2,
        fillColor: "#FFF8F2",
        fillOpacity: 1,
      }).addTo(instance);

      const staticT = progressFor(status);
      if (staticT == null) {
        const start = performance.now();
        const loop = (now: number) => {
          const t = (Math.sin((now - start) / 2800) + 1) / 2 * 0.82 + 0.1;
          rider.setLatLng(along(t));
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
      } else {
        rider.setLatLng(along(staticT));
      }

      map = instance;
    })();

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      map?.remove();
    };
  }, [status]);

  return (
    <div className="relative overflow-hidden bg-navy">
      <div ref={el} className="h-[340px] w-full md:h-[420px]" role="img" aria-label="Delivery map of Lagos" />
      <p className="pointer-events-none absolute left-4 top-4 text-[11px] font-semibold tracking-label text-cream">
        Lagos · Adeola Odeku → Lekki
      </p>
    </div>
  );
}
