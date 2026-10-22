import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

const KITCHEN: [number, number] = [6.4284, 3.4241];

export function LiveMap() {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    let cancelled = false;
    let map: { remove: () => void } | null = null;

    void (async () => {
      const L = await import("leaflet");
      if (cancelled || !el.current) return;

      const instance = L.map(el.current, {
        zoomControl: false,
        attributionControl: true,
        scrollWheelZoom: false,
      }).setView(KITCHEN, 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19,
      }).addTo(instance);

      L.circleMarker(KITCHEN, {
        radius: 9,
        color: "#FFF8F2",
        weight: 2,
        fillColor: "#D71920",
        fillOpacity: 1,
      })
        .addTo(instance)
        .bindTooltip("DreamTable · 14 Adeola Odeku, Victoria Island", {
          permanent: true,
          direction: "right",
          className: "map-tip",
        });

      map = instance;
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, []);

  return (
    <div className="relative overflow-hidden bg-navy">
      <div ref={el} className="h-[280px] w-full md:h-[360px]" role="img" aria-label="Map of DreamTable, Victoria Island" />
      <p className="pointer-events-none absolute left-4 top-4 max-w-xs text-[11px] font-semibold tracking-label text-cream">
        Restaurant location · status changes when the kitchen updates the ticket
      </p>
    </div>
  );
}
