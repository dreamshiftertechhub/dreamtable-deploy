import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/format";
import { listPassCalls, type PassCall } from "@/lib/house.functions";
import { useMimi } from "@/store/use-mimi";
import { useUi } from "@/store/use-ui";

export function usePassPlates() {
  const items = useMimi((s) => s.items);
  const orders = useMimi((s) => s.orders);
  const called = useMimi((s) => s.calledIds ?? []);
  const [remote, setRemote] = useState<PassCall[]>([]);

  useEffect(() => {
    let live = true;
    void listPassCalls()
      .then((rows) => {
        if (live) setRemote(rows);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [called.join("|")]);

  const liveTickets = orders
    .filter((o) => o.status === "preparing" || o.status === "ready")
    .flatMap((o) => o.items.slice(0, 1).map((line) => line.menuItemId));

  const ids = [...new Set([...remote.map((r) => r.menuItemId), ...called, ...liveTickets])];
  const plates = ids
    .map((id) => {
      const item = items.find((i) => i.id === id);
      if (!item) return null;
      const note = remote.find((r) => r.menuItemId === id)?.note;
      return { item, note: note || "Called from the pass" };
    })
    .filter((p): p is { item: (typeof items)[number]; note: string } => !!p);

  return plates;
}

export function PassBoard({ limit }: { limit?: number }) {
  const plates = usePassPlates();
  const add = useMimi((s) => s.addToCart);
  const setCart = useUi((s) => s.setCartOpen);
  const shown = limit ? plates.slice(0, limit) : plates;

  if (shown.length === 0) {
    return (
      <p className="text-muted">
        The pass is quiet. When the kitchen calls a plate, it lands here for one tap.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-line border-y border-line">
      {shown.map(({ item, note }) => (
        <li key={item.id} className="flex flex-wrap items-center gap-4 py-4">
          <img src={item.image} alt="" className="size-16 object-cover" />
          <div className="min-w-0 flex-1">
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-muted">{note}</p>
          </div>
          <p className="tabular-nums">{formatNaira(item.price)}</p>
          <Button
            size="sm"
            onClick={() => {
              add({
                menuItemId: item.id,
                name: item.name,
                image: item.image,
                unitPrice: item.price,
                quantity: 1,
                extras: [],
                notes: "From the pass",
              });
              toast(`${item.name} is in the bag.`);
              setCart(true);
            }}
          >
            I'll have this
          </Button>
        </li>
      ))}
    </ul>
  );
}

export function PassLink() {
  return (
    <Link to="/pass" className="text-[11px] font-semibold tracking-label text-brand">
      See the pass
    </Link>
  );
}
