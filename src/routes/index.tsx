import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, Heart, Plus } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { FoodCard } from "@/components/food/food-card";
import { SpiceDots } from "@/components/food/spice";
import { SIGNATURES } from "@/data/menu";
import { REVIEWS } from "@/data/seeds";
import { KITCHEN_CLOSES } from "@/data/types";
import { formatNaira } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useMimi } from "@/store/use-mimi";
import { useUi } from "@/store/use-ui";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <SiteShell overlayNav>
      <Hero />
      <Signatures />
      <PlateTeaser />
      <Reviews />
      <StoryTeaser />
      <LoyaltyTeaser />
      <CateringTeaser />
      <ReserveTeaser />
    </SiteShell>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-ink text-white">
      <img
        src="/food/hero.jpg"
        alt="A table at DreamTable: jollof, grilled chicken, suya and Chapman"
        className="hero-zoom absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-ink/30" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 md:px-8 md:pb-20">
        <p className="reveal text-[11px] font-semibold tracking-label text-white/80" style={{ animationDelay: "80ms" }}>
          Victoria Island · Lagos
        </p>
        <p
          className="reveal mt-3 font-script text-[18vw] leading-[0.78] text-white md:text-[8.5rem]"
          style={{ animationDelay: "140ms" }}
        >
          Dream
        </p>
        <p
          className="reveal font-script text-[18vw] leading-[0.78] text-white md:text-[8.5rem]"
          style={{ animationDelay: "180ms" }}
        >
          Table
        </p>
        <h1
          className="reveal mt-6 max-w-2xl font-display text-4xl leading-[1.02] md:mt-7 md:text-6xl md:leading-[1.04]"
          style={{ animationDelay: "220ms" }}
        >
          Nigerian flavour,
          <br />
          thoughtfully elevated.
        </h1>
        <p className="reveal mt-5 max-w-lg text-base leading-7 text-white/80 md:mt-6 md:text-[17px] md:leading-8" style={{ animationDelay: "320ms" }}>
          An elevated Lagos dining experience where bold Nigerian flavours, refined technique, and warm hospitality meet at the table.
        </p>
        <div className="reveal mt-9 flex flex-wrap items-center gap-3 md:mt-10" style={{ animationDelay: "420ms" }}>
          <Button asChild size="lg" variant="default">
            <Link to="/order">Order now</Link>
          </Button>
          <Button asChild size="lg" variant="inverse">
            <Link to="/menu">Explore menu</Link>
          </Button>
        </div>
        <div className="reveal mt-12 flex flex-wrap items-end justify-between gap-5 md:mt-14" style={{ animationDelay: "520ms" }}>
          <p className="flex items-center gap-2 text-[11px] tracking-label">
            <span className="size-2 rounded-full bg-ok" aria-hidden />
            Open now · Kitchen closes {KITCHEN_CLOSES}
          </p>
          <a href="#signatures" className="inline-flex items-center gap-2 text-[11px] tracking-label">
            Scroll to taste <ArrowDown className="size-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Signatures() {
  const featured = SIGNATURES[0];
  const open = useUi((s) => s.openFood);
  const fav = useMimi((s) => s.favouriteIds.includes(featured?.id ?? ""));
  const toggle = useMimi((s) => s.toggleFavourite);

  return (
    <section id="signatures" className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
      <p className="text-[11px] font-semibold tracking-label text-brand">The kitchen</p>
      <h2 className="mt-3 max-w-2xl font-display text-4xl leading-tight md:text-6xl">
        The ones you'll think about tomorrow.
      </h2>

      {featured && (
        <div className="mt-12 hidden grid-cols-12 gap-10 md:grid">
          <button
            type="button"
            onClick={() => open(featured.id)}
            className="group relative col-span-7 overflow-hidden"
          >
            <img
              src={featured.image}
              alt={featured.name}
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute left-6 top-6 font-display text-5xl text-white">01</span>
          </button>
          <div className="col-span-5 flex flex-col justify-center">
            <p className="text-[11px] tracking-label text-muted">Signature</p>
            <h3 className="mt-2 font-display text-4xl">{featured.name}</h3>
            <p className="mt-4 text-muted">{featured.description}</p>
            <div className="mt-5 flex items-center gap-3">
              <span className="font-semibold tabular-nums">{formatNaira(featured.price)}</span>
              <SpiceDots level={featured.spice} />
            </div>
            <div className="mt-6 flex items-center gap-2">
              <Button onClick={() => open(featured.id)}>
                <Plus className="size-4" /> Add
              </Button>
              <button
                type="button"
                aria-label="Favourite"
                onClick={() => toggle(featured.id)}
                className="grid size-11 place-items-center border border-line"
              >
                <Heart className={cn("size-4", fav && "fill-brand text-brand")} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 flex snap-x gap-5 overflow-x-auto pb-4 no-scrollbar md:mt-16 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible">
        {SIGNATURES.map((item, i) => (
          <div key={item.id} className={i === 0 ? "md:hidden" : ""}>
            <FoodCard item={item} layout="rail" />
          </div>
        ))}
      </div>
    </section>
  );
}

function PlateTeaser() {
  return (
    <section className="bg-navy text-cream">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-8 md:py-24">
        <div>
          <p className="text-[11px] tracking-label text-cream/60">Build your plate</p>
          <h2 className="mt-3 font-display text-4xl md:text-6xl">You know how you like it.</h2>
          <p className="mt-4 max-w-md text-cream/75">
            Base, protein, sauce, extras. Watch the price change as you build. Then send it to the kitchen.
          </p>
          <Button asChild size="lg" variant="cream" className="mt-8">
            <Link to="/build">
              Build my plate <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <img src="/food/jollof.jpg" alt="Jollof rice" className="aspect-[4/3] w-full object-cover" />
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
      <p className="text-[11px] font-semibold tracking-label text-brand">From the table</p>
      <h2 className="mt-3 max-w-xl font-display text-4xl md:text-6xl">Don't take our word for it.</h2>
      <div className="mt-12 space-y-16">
        {REVIEWS.map((r, i) => (
          <blockquote
            key={r.name}
            className={`grid items-center gap-8 md:grid-cols-12 ${i % 2 === 1 ? "md:text-right" : ""}`}
          >
            <img
              src={r.image}
              alt=""
              className={`aspect-[4/3] w-full object-cover md:col-span-5 ${i % 2 === 1 ? "md:col-start-8" : ""}`}
            />
            <div className={`md:col-span-6 ${i % 2 === 1 ? "md:col-start-1 md:row-start-1" : ""}`}>
              <p className="font-display text-3xl leading-snug md:text-5xl">“{r.quote}”</p>
              <footer className="mt-6 text-sm text-muted">
                {r.name} · {r.dish}
              </footer>
            </div>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

function StoryTeaser() {
  return (
    <section className="relative overflow-hidden">
      <img src="/food/chicken.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-ink/70" />
      <div className="relative mx-auto max-w-3xl px-4 py-28 text-center text-white md:py-36">
        <p className="text-[11px] tracking-label">Our story</p>
        <h2 className="mt-4 font-display text-4xl md:text-6xl">Food first. Everything else follows.</h2>
        <p className="mx-auto mt-5 max-w-lg text-white/80">
          DreamTable was created around one simple idea — food should bring people together.
        </p>
        <Button asChild size="lg" variant="inverse" className="mt-8">
          <Link to="/story">Read the story</Link>
        </Button>
      </div>
    </section>
  );
}

function LoyaltyTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
      <div className="grid gap-8 border-y border-line py-16 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-[11px] tracking-label text-navy">The Circle</p>
          <h2 className="mt-3 font-display text-4xl">Points for showing up hungry.</h2>
          <p className="mt-3 max-w-md text-muted">
            Earn on every order. Trade them for sides, drinks, or a main on us.
          </p>
        </div>
        <div className="md:text-right">
          <Button asChild variant="navy" size="lg">
            <Link to="/loyalty">See your table</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function CateringTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 md:px-8">
      <div className="grid gap-8 border-y border-line py-16 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-[11px] tracking-label text-brand">Private dining</p>
          <h2 className="mt-3 font-display text-4xl">Birthdays. Boardrooms. The whole street.</h2>
          <p className="mt-3 max-w-md text-muted">
            Catering from twenty plates. A private room upstairs for twelve.
          </p>
        </div>
        <div className="md:text-right">
          <Button asChild variant="outline" size="lg">
            <Link to="/catering">Plan an event</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function ReserveTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 md:px-8">
      <div className="bg-brand px-6 py-14 text-white md:px-16 md:py-20">
        <p className="text-[11px] tracking-label text-white/70">Tonight</p>
        <h2 className="mt-3 font-display text-4xl md:text-6xl">Your table is waiting.</h2>
        <p className="mt-4 max-w-md text-white/80">Date night, birthdays, the long overdue catch-up.</p>
        <Button asChild size="lg" variant="inverse" className="mt-8">
          <Link to="/reservations">Reserve table</Link>
        </Button>
      </div>
    </section>
  );
}
