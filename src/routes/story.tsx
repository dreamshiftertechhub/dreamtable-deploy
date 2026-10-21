import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";

export const Route = createFileRoute("/story")({ component: StoryPage });

function StoryPage() {
  return (
    <SiteShell overlayNav>
      <section className="relative min-h-[80svh] bg-ink text-white">
        <img src="/food/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-ink/50" />
        <div className="relative mx-auto flex min-h-[80svh] max-w-4xl items-end px-4 pb-16 pt-32 md:px-8">
          <h1 className="font-display text-5xl leading-[0.95] md:text-7xl">
            Food first.
            <br />
            Everything else follows.
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-20 md:py-28">
        <p className="font-display text-2xl leading-snug md:text-3xl">
          DreamTable was created around one simple idea — food should bring people together.
        </p>
        <p className="mt-6 text-muted leading-relaxed">
          We blend Nigerian flavour, modern presentation and warm hospitality. No gimmicks. No
          small plates pretending to be dinner. Just the food people actually talk about the next
          day — jollof with a proper smoky edge, suya that bites back, a burger that doesn't
          apologise.
        </p>
      </section>

      <StoryBlock
        kicker="Our kitchen"
        title="The pass is the heart of the room."
        copy="Service starts when the rice hits the pot. We cook in small batches so the jollof stays smoky, the plantain stays hot, and nothing sits under a lamp. If a dish isn't ready, we tell you — we don't plate around it."
        image="/food/jollof.jpg"
      />
      <StoryBlock
        kicker="Our flavour"
        title="Lagos on a plate. Not a costume."
        copy="Pepper is a seasoning, not a dare. We grind ours daily. The suya spice is roasted in-house. The Chapman is the one your auntie would recognise — cucumber, orange, a little theatre."
        image="/food/suya-fries.jpg"
        flip
      />
      <StoryBlock
        kicker="Our people"
        title="The table is the point."
        copy="Hosts who remember how you take your heat. Riders named Daniel who actually call when they're downstairs. A dining room on Adeola Odeku that still feels like someone's house — if that someone had excellent lighting and a serious grill."
        image="/food/chicken.jpg"
      />
    </SiteShell>
  );
}

function StoryBlock({
  kicker,
  title,
  copy,
  image,
  flip,
}: {
  kicker: string;
  title: string;
  copy: string;
  image: string;
  flip?: boolean;
}) {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-12 md:px-8 md:py-24">
      <img
        src={image}
        alt=""
        className={`aspect-[4/3] w-full object-cover md:col-span-6 ${flip ? "md:col-start-7" : ""}`}
      />
      <div className={`md:col-span-5 ${flip ? "md:col-start-1 md:row-start-1" : ""}`}>
        <p className="text-[11px] tracking-label text-brand">{kicker}</p>
        <h2 className="mt-3 font-display text-4xl">{title}</h2>
        <p className="mt-4 leading-relaxed text-muted">{copy}</p>
      </div>
    </section>
  );
}
