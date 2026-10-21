import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formatNaira } from "@/lib/format";
import { useMimi } from "@/store/use-mimi";
import { useUi } from "@/store/use-ui";

export function SearchOverlay() {
  const open = useUi((s) => s.searchOpen);
  const setOpen = useUi((s) => s.setSearchOpen);
  const openFood = useUi((s) => s.openFood);
  const items = useMimi((s) => s.items);
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items.filter((i) => i.popular).slice(0, 6);
    return items.filter((i) => `${i.name} ${i.description}`.toLowerCase().includes(query));
  }, [items, q]);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setQ("");
      }}
    >
      <DialogContent className="max-w-xl p-0">
        <div className="p-6 pb-2">
          <DialogTitle className="sr-only">Search the menu</DialogTitle>
          <DialogDescription className="sr-only">Find a dish</DialogDescription>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <Input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Chicken, jollof, suya…"
              className="pl-10"
              aria-label="Search dishes"
            />
          </div>
        </div>
        <ul className="max-h-[60vh] overflow-y-auto pb-4">
          {results.length === 0 ? (
            <li className="px-6 py-10">
              <p className="font-display text-2xl">Nothing matched that craving.</p>
              <p className="mt-2 text-sm text-muted">Try our Signature Jollof.</p>
              <button
                type="button"
                className="mt-4 text-sm font-semibold text-brand"
                onClick={() => {
                  setOpen(false);
                  openFood("signature-jollof");
                }}
              >
                Open Signature Jollof
              </button>
            </li>
          ) : (
            results.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 px-6 py-3 text-left hover:bg-surface"
                  onClick={() => {
                    setOpen(false);
                    openFood(item.id);
                  }}
                >
                  <img src={item.image} alt="" className="size-14 object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{item.name}</span>
                    <span className="block truncate text-sm text-muted">{item.description}</span>
                  </span>
                  <span className="text-sm tabular-nums">{formatNaira(item.price)}</span>
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="border-t border-line px-6 py-3 text-xs text-muted">
          Or browse the{" "}
          <Link to="/menu" className="text-navy" onClick={() => setOpen(false)}>
            full menu
          </Link>
          .
        </div>
      </DialogContent>
    </Dialog>
  );
}
