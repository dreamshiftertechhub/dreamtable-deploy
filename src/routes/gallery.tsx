import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";

export const Route = createFileRoute("/gallery")({ component: GalleryPage });

const SHOTS = [
  { src: "/food/jollof.jpg", alt: "Signature jollof and grilled chicken", span: "md:col-span-7" },
  { src: "/food/suya-fries.jpg", alt: "Suya loaded fries", span: "md:col-span-5" },
  { src: "/food/chicken.jpg", alt: "Fire-grilled chicken", span: "md:col-span-5" },
  { src: "/food/pasta.jpg", alt: "Creamy chicken pasta", span: "md:col-span-7" },
  { src: "/food/seafood.jpg", alt: "Seafood pepper rice", span: "md:col-span-4" },
  { src: "/food/ofada.jpg", alt: "Ofada rice", span: "md:col-span-4" },
  { src: "/food/chocolate.jpg", alt: "Chocolate indulgence", span: "md:col-span-4" },
  { src: "/food/burger.jpg", alt: "DreamTable beef burger", span: "md:col-span-6" },
  { src: "/food/hero.jpg", alt: "The table", span: "md:col-span-6" },
];

function GalleryPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 md:px-8 md:pt-32">
        <p className="text-[11px] tracking-label text-brand">The table</p>
        <h1 className="mt-3 max-w-2xl font-display text-5xl md:text-6xl">What the room looks like.</h1>
        <div className="mt-12 grid gap-4 md:grid-cols-12">
          {SHOTS.map((s) => (
            <img key={s.src} src={s.src} alt={s.alt} className={`aspect-[4/3] w-full object-cover ${s.span}`} />
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
