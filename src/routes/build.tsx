import { useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  EXTRAS,
  PLATE_BASES,
  PLATE_PROTEINS,
  PLATE_SAUCES,
  type ExtraId,
  type PlateBase,
  type PlateSauce,
  type Protein,
} from "@/data/types";
import { extraCost, useMimi } from "@/store/use-mimi";
import { useUi } from "@/store/use-ui";

export const Route = createFileRoute("/build")({ component: BuildPage });

function BuildPage() {
  const [base, setBase] = useState<PlateBase>("jollof");
  const [protein, setProtein] = useState<Protein>("chicken");
  const [sauce, setSauce] = useState<PlateSauce>("signature");
  const [extras, setExtras] = useState<ExtraId[]>([]);
  const add = useMimi((s) => s.addToCart);
  const setCart = useUi((s) => s.setCartOpen);

  const baseP = PLATE_BASES.find((b) => b.id === base)!;
  const protP = PLATE_PROTEINS.find((p) => p.id === protein)!;
  const sauceL = PLATE_SAUCES.find((s) => s.id === sauce)!;
  const total = baseP.price + protP.price + extraCost(extras);

  function toggle(id: ExtraId) {
    setExtras((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  }

  return (
    <SiteShell>
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-24 md:grid-cols-12 md:px-8 md:pt-32">
        <div className="md:col-span-7">
          <p className="text-[11px] font-semibold tracking-label text-brand">Build your plate</p>
          <h1 className="mt-3 font-display text-4xl md:text-6xl">Four decisions. One plate.</h1>

          <Step n="01" title="Choose your base">
            {PLATE_BASES.map((b) => (
              <Chip
                key={b.id}
                on={base === b.id}
                onClick={() => setBase(b.id)}
                label={`${b.label} · ${formatNaira(b.price)}`}
              />
            ))}
          </Step>
          <Step n="02" title="Choose your protein">
            {PLATE_PROTEINS.map((p) => (
              <Chip
                key={p.id}
                on={protein === p.id}
                onClick={() => setProtein(p.id)}
                label={`${p.label} · ${formatNaira(p.price)}`}
              />
            ))}
          </Step>
          <Step n="03" title="Choose your sauce">
            {PLATE_SAUCES.map((s) => (
              <Chip key={s.id} on={sauce === s.id} onClick={() => setSauce(s.id)} label={s.label} />
            ))}
          </Step>
          <Step n="04" title="Choose extras">
            {EXTRAS.filter((e) => e.id !== "extra-sauce").map((e) => (
              <Chip
                key={e.id}
                on={extras.includes(e.id)}
                onClick={() => toggle(e.id)}
                label={`${e.label} · ${formatNaira(e.price)}`}
              />
            ))}
          </Step>
        </div>

        <aside className="md:col-span-5">
          <div className="sticky top-24 border border-line bg-paper p-6 md:p-8">
            <p className="text-[11px] tracking-label text-muted">Your plate</p>
            <h2 className="mt-2 font-display text-3xl">
              {baseP.label} · {protP.label}
            </h2>
            <ul className="mt-6 space-y-2 text-sm">
              <li className="flex justify-between">
                <span>{baseP.label}</span>
                <span className="tabular-nums">{formatNaira(baseP.price)}</span>
              </li>
              <li className="flex justify-between">
                <span>{protP.label}</span>
                <span className="tabular-nums">{formatNaira(protP.price)}</span>
              </li>
              <li className="flex justify-between">
                <span>{sauceL.label}</span>
                <span className="tabular-nums">Included</span>
              </li>
              {extras.map((id) => {
                const e = EXTRAS.find((x) => x.id === id)!;
                return (
                  <li key={id} className="flex justify-between">
                    <span>{e.label}</span>
                    <span className="tabular-nums">{formatNaira(e.price)}</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-8 flex items-end justify-between border-t border-line pt-4">
              <span className="text-[11px] tracking-label">Total</span>
              <span className="font-display text-4xl tabular-nums">{formatNaira(total)}</span>
            </p>
            <Button
              size="lg"
              className="mt-6 w-full"
              onClick={() => {
                add({
                  menuItemId: `plate-${base}-${protein}`,
                  name: `Your plate · ${baseP.label} & ${protP.label}`,
                  image: base === "pasta" ? "/food/pasta.jpg" : "/food/jollof.jpg",
                  unitPrice: total,
                  quantity: 1,
                  protein,
                  extras,
                  customLabel: sauceL.label,
                });
                toast("Added to your order.");
                setCart(true);
              }}
            >
              Build my plate
            </Button>
          </div>
        </aside>
      </div>
    </SiteShell>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl">
        <span className="text-brand">{n}</span> {title}
      </h2>
      <div className="mt-4 flex flex-wrap gap-2">{children}</div>
    </section>
  );
}

function Chip({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "h-12 px-4 text-[11px] font-semibold tracking-label border",
        on ? "border-ink bg-ink text-cream" : "border-line bg-paper hover:border-ink",
      )}
    >
      {label}
    </button>
  );
}
