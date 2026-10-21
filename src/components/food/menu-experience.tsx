import { useMemo, useState } from "react";
import { FoodCard } from "@/components/food/food-card";
import { EMPTY_FILTERS, MenuFilters, type FilterState } from "@/components/food/menu-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { filterMenu } from "@/lib/menu-query";
import { useMimi } from "@/store/use-mimi";
import { useUi } from "@/store/use-ui";

export function MenuExperience({ kicker, title }: { kicker: string; title: string }) {
  const items = useMimi((s) => s.items);
  const hydrated = useMimi((s) => s.hydrated);
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const results = useMemo(() => filterMenu(items, filters), [items, filters]);
  const open = useUi((s) => s.openFood);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 md:px-8 md:pt-32">
      <p className="text-[11px] font-semibold tracking-label text-brand">{kicker}</p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl md:text-6xl">{title}</h1>
      <div className="mt-10">
        <MenuFilters value={filters} onChange={setFilters} />
      </div>
      <p className="mt-6 text-sm text-muted">{results.length} dishes</p>
      {!hydrated ? (
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-[4/3] w-full" />
              <Skeleton className="mt-4 h-6 w-2/3" />
              <Skeleton className="mt-2 h-4 w-full" />
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="mt-16 max-w-lg">
          <h2 className="font-display text-4xl">Nothing matched that craving.</h2>
          <p className="mt-3 text-muted">Try our Signature Jollof.</p>
          <button
            type="button"
            className="mt-6 text-sm font-semibold text-brand"
            onClick={() => open("signature-jollof")}
          >
            Open Signature Jollof
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
