import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";

export const Route = createFileRoute("/legal")({ component: LegalPage });

function LegalPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-24 md:pt-32">
        <p className="text-[11px] tracking-label text-brand">House rules</p>
        <h1 className="mt-3 font-display text-5xl">Terms & privacy</h1>

        <h2 id="terms" className="mt-14 font-display text-3xl">
          Terms
        </h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted">
          <p>
            Orders placed here are cooked at DreamTable, 14 Adeola Odeku Street, Victoria Island, Lagos. Prices
            are in naira and include the dish as described. Delivery fees apply under ₦25,000.
          </p>
          <p>
            Reservations are held for 15 minutes. Catering quotes are confirmed in writing before we shop.
            Loyalty points have no cash value and can be withdrawn if we catch abuse.
          </p>
          <p>
            Pay by transfer to Dreamtable, Moniepoint, account 9015828778. Cash and card are taken when the food
            arrives. We do not store card numbers on this site.
          </p>
        </div>

        <h2 id="privacy" className="mt-14 font-display text-3xl">
          Privacy
        </h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted">
          <p>
            We keep your name, phone, and delivery address so we can cook and find you. We do not sell
            guest lists. Messages to the events desk stay with the house.
          </p>
          <p>
            Orders you place stay on this device, and with the house if you are signed in, so the kitchen
            can cook them and you can track them. We do not sell guest lists.
          </p>
          <p>Questions — hello@dreamtable.ng or {`+234 201 330 1840`}.</p>
        </div>
      </div>
    </SiteShell>
  );
}
