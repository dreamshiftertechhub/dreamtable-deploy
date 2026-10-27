import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, Heart, Plus, ShoppingBag } from "lucide-react";
import { PassBoard, PassLink } from "@/components/pass/pass-board";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { FoodCard } from "@/components/food/food-card";
import { SpiceDots } from "@/components/food/spice";
import { SIGNATURES } from "@/data/menu";
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
      <PassTeaser />
      <PlateTeaser />
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
        alt="Illustrative Nigerian food photography for the RealMeal concept"
        className="hero-zoom absolute inset-0 h-full w-full object-cover object-[72%_42%] md:object-[64%_center]"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/45 to-ink/25 md:bg-gradient-to-r md:from-ink/90 md:via-ink/55 md:to-transparent"
        aria-hidden
      />
      <div className="hero-steam" aria-hidden />
      <div className="hero-steam hero-steam-b" aria-hidden />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col items-center justify-center px-4 pb-24 pt-28 text-center md:items-start md:px-8 md:text-left">
        <p
          className="reveal inline-flex items-center gap-2 rounded-full border border-white/25 bg-ink/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
          style={{ animationDelay: "0ms" }}
        >
          <span className="size-1.5 rounded-full bg-ok" aria-hidden />
          Preview website · Opening later
        </p>
        <h1
          className="reveal mt-6 max-w-xl font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] text-white"
          style={{ animationDelay: "100ms" }}
        >
          Come hungry.
          <br />
          Leave talking.
        </h1>
        <p
          className="reveal mt-5 max-w-md text-lg leading-snug text-white md:text-xl"
          style={{ animationDelay: "200ms" }}
        >
          Nigerian favourites are coming to selected areas of Lekki and Ajah. Preview our proposed menu while our online kitchen prepares to launch.
        </p>
        <div
          className="reveal mt-8 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row md:w-auto"
          style={{ animationDelay: "300ms" }}
        >
          <Link
            to="/menu"
            className="inline-flex h-12 w-full items-center justify-center gap-2 bg-brand px-7 text-[11px] font-semibold tracking-label text-white transition duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-[0_14px_32px_-10px_rgba(215,25,32,0.85)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
          >
            <ShoppingBag className="size-4" aria-hidden />
            Preview the menu
          </Link>
          <Link
            to="/menu"
            className="inline-flex h-12 w-full items-center justify-center border border-white bg-transparent px-7 text-[11px] font-semibold tracking-label text-white transition duration-200 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
          >
            Explore menu
          </Link>
        </div>
        <ul
          className="reveal mt-8 flex max-w-md flex-col items-center gap-2 text-sm text-white/90 md:max-w-none md:flex-row md:gap-0"
          style={{ animationDelay: "400ms" }}
        >
          <li>Sample menu · Indicative prices</li>
          <li className="mx-3 hidden text-white/40 md:inline" aria-hidden>
            ·
          </li>
          <li>Orders not open yet</li>
          <li className="mx-3 hidden text-white/40 md:inline" aria-hidden>
            ·
          </li>
          <li>No payments accepted</li>
        </ul>
        <p className="sr-only">Kitchen closes {KITCHEN_CLOSES}</p>
      </div>
      <a
        href="#signatures"
        className="absolute bottom-6 left-1/2 z-10 inline-flex -translate-x-1/2 flex-col items-center gap-1 text-[11px] tracking-label text-white/80"
      >
        Scroll
        <ArrowDown className="size-4" aria-hidden />
      </a>
    </section>
  );
}

function PassTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-label text-brand">Only at this table</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">The pass</h2>
          <p className="mt-3 max-w-md text-muted">
            The kitchen calls a plate as it leaves the window. Order it in one tap — not a specials PDF from last week.
          </p>
        </div>
        <PassLink />
      </div>
      <div className="mt-8">
        <PassBoard limit={3} />
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
            Base, protein, sauce, extras. Watch the price change as you build. Explore combinations for our future kitchen.
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

function StoryTeaser() {
  return (
    <section className="relative overflow-hidden">
      <img src="/food/chicken.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-ink/70" />
      <div className="relative mx-auto max-w-3xl px-4 py-28 text-center text-white md:py-36">
        <p className="text-[11px] tracking-label">Our story</p>
        <h2 className="mt-4 font-display text-4xl md:text-6xl">Food first. Everything else follows.</h2>
        <p className="mx-auto mt-5 max-w-lg text-white/80">
          RealMeal was created around one simple idea — food should bring people together.
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
            A preview of the rewards experience we hope to offer after launch.
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
            Our future catering experience is taking shape. Bookings are not yet open.
          </p>
        </div>
        <div className="md:text-right">
          <Button asChild variant="outline" size="lg">
            <Link to="/catering">See catering preview</Link>
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
        <p className="text-[11px] tracking-label text-white/70">Coming later</p>
        <h2 className="mt-3 font-display text-4xl md:text-6xl">A table worth waiting for.</h2>
        <p className="mt-4 max-w-md text-white/80">Date night, birthdays, the long overdue catch-up.</p>
        <Button asChild size="lg" variant="inverse" className="mt-8">
          <Link to="/reservations">Reservations coming soon</Link>
        </Button>
      </div>
    </section>
  );
}
