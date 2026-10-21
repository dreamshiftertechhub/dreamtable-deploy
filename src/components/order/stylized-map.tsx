import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/data/types";

export function StylizedMap({ status }: { status: OrderStatus }) {
  const moving = status === "out-for-delivery";
  return (
    <div className="relative overflow-hidden bg-navy text-cream">
      <svg viewBox="0 0 640 420" className="h-[340px] w-full md:h-[420px]" role="img" aria-label="Delivery map">
        <rect width="640" height="420" fill="#102A72" />
        <g opacity="0.18" stroke="#FFF8F2" strokeWidth="1.2" fill="none">
          <path d="M0 80 H640 M0 140 H640 M0 210 H640 M0 280 H640 M0 340 H640" />
          <path d="M70 0 V420 M150 0 V420 M240 0 V420 M330 0 V420 M430 0 V420 M530 0 V420" />
        </g>
        <path
          d="M90 300 C160 270, 180 200, 250 190 S360 230, 400 160 S500 90, 560 110"
          fill="none"
          stroke="#D71920"
          strokeWidth="3"
          strokeDasharray="8 6"
          className={moving ? "origin-center" : undefined}
          style={moving ? { animation: "dash 1.2s linear infinite" } : undefined}
        />
        <circle cx="90" cy="300" r="10" fill="#FFF8F2" />
        <text x="108" y="304" fill="#FFF8F2" fontSize="11" fontFamily="Manrope, sans-serif">
          DreamTable · VI
        </text>
        <circle cx="560" cy="110" r="10" fill="#D71920" />
        <text x="430" y="96" fill="#FFF8F2" fontSize="11" fontFamily="Manrope, sans-serif">
          Lekki Phase 1
        </text>
        <g
          className={cn(moving && "rider-dot")}
          style={
            moving
              ? {
                  offsetPath: "path('M90 300 C160 270, 180 200, 250 190 S360 230, 400 160 S500 90, 560 110')",
                  animation: "rider 8s ease-in-out infinite alternate",
                }
              : { transform: "translate(400px, 160px)" }
          }
        >
          <circle r="8" fill="#FFF8F2" />
          <circle r="3" fill="#D71920" />
        </g>
        <text x="24" y="36" fill="#FFF8F2" fontSize="12" letterSpacing="2" fontFamily="Manrope, sans-serif">
          LAGOS · LIVE
        </text>
        <text x="24" y="400" fill="#FFF8F2" opacity="0.6" fontSize="11" fontFamily="Manrope, sans-serif">
          Adeola Odeku → Admiralty Road
        </text>
      </svg>
    </div>
  );
}
