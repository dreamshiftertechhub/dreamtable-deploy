import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/faq")({ component: FaqPage });

const QUESTIONS = [
  {
    q: "Where do you deliver?",
    a: "Victoria Island, Ikoyi, and Lekki Phase 1. Orders over ₦25,000 travel free. Everywhere else is pickup on Adeola Odeku.",
  },
  {
    q: "How spicy is the food?",
    a: "You set the heat when you customise a plate: mild, medium, hot, extra hot. Signature jollof lands at medium unless you say otherwise.",
  },
  {
    q: "Can you cook for a wedding or office lunch?",
    a: "Yes. Drop-off, staffed service, or a live jollof and suya station. Tell the events desk the date and the headcount.",
  },
  {
    q: "Do you have a private room?",
    a: "Twelve seats upstairs, reserved by the evening. Book it through catering, not the regular table form.",
  },
  {
    q: "How do I track an order?",
    a: "Open Track order and enter the number from your confirmation. The status stays where the kitchen left it — new, preparing, ready, on the way, or delivered. The map shows the restaurant on Adeola Odeku, not a moving rider.",
  },
  {
    q: "Is there parking?",
    a: "Street parking on Adeola Odeku, plus the public lot behind the Wings complex, a three-minute walk.",
  },
  {
    q: "Allergies?",
    a: "Tell us in the special instructions on the dish, or call the kitchen. Nuts sit in the suya spice. We can hold them back.",
  },
  {
    q: "How do I pay?",
    a: "Transfer to Dreamtable, Moniepoint, 9015828778. Use your name as the narration. You can also pay cash or by card when the food arrives.",
  },
  {
    q: "How do I reach the kitchen?",
    a: "Sign in, open Kitchen, and take the keys if you are the owner. Staff you add can move tickets on the order board.",
  },
];

function FaqPage() {
  const [open, setOpen] = useState(0);
  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-24 md:pt-32">
        <p className="text-[11px] tracking-label text-brand">Before you arrive</p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">Questions.</h1>
        <ul className="mt-12 divide-y divide-line border-y border-line">
          {QUESTIONS.map((item, i) => (
            <li key={item.q}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-6 py-5 text-left"
                aria-expanded={open === i}
                onClick={() => setOpen(open === i ? -1 : i)}
              >
                <span className="font-display text-2xl">{item.q}</span>
                <span className="text-brand">{open === i ? "–" : "+"}</span>
              </button>
              {open === i && <p className="pb-5 text-sm leading-relaxed text-muted">{item.a}</p>}
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/catering">Plan an event</Link>
          </Button>
          <Button asChild variant="outline">
            <a href="https://wa.me/2342013301840">WhatsApp the house</a>
          </Button>
        </div>
      </div>
    </SiteShell>
  );
}
