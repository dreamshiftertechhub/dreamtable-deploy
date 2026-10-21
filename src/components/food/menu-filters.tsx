import { CATEGORIES, CATEGORY_LABELS, type Category } from "@/data/types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SortKey = "popular" | "price-asc" | "price-desc" | "name";

export interface FilterState {
  query: string;
  category: Category;
  sort: SortKey;
  popular: boolean;
  spicy: boolean;
  vegetarian: boolean;
}

export const EMPTY_FILTERS: FilterState = {
  query: "",
  category: "all",
  sort: "popular",
  popular: false,
  spicy: false,
  vegetarian: false,
};

export function MenuFilters({
  value,
  onChange,
}: {
  value: FilterState;
  onChange: (next: FilterState) => void;
}) {
  return (
    <div className="space-y-5">
      <Input
        value={value.query}
        onChange={(e) => onChange({ ...value, query: e.target.value })}
        placeholder="Search the kitchen…"
        aria-label="Search menu"
      />
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange({ ...value, category: c })}
            className={cn(
              "h-10 shrink-0 px-4 text-[11px] font-semibold tracking-label border",
              value.category === c
                ? "border-ink bg-ink text-cream"
                : "border-line bg-transparent text-ink hover:border-ink",
            )}
          >
            {CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Toggle
          on={value.popular}
          onClick={() => onChange({ ...value, popular: !value.popular })}
          label="Popular"
        />
        <Toggle
          on={value.spicy}
          onClick={() => onChange({ ...value, spicy: !value.spicy })}
          label="Spicy"
        />
        <Toggle
          on={value.vegetarian}
          onClick={() => onChange({ ...value, vegetarian: !value.vegetarian })}
          label="Vegetarian"
        />
        <div className="ml-auto w-44">
          <Select
            value={value.sort}
            onValueChange={(v) => onChange({ ...value, sort: v as SortKey })}
          >
            <SelectTrigger aria-label="Sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Popular first</SelectItem>
              <SelectItem value="price-asc">Price · low</SelectItem>
              <SelectItem value="price-desc">Price · high</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "h-10 px-4 text-[11px] font-semibold tracking-label border",
        on ? "border-brand bg-brand text-white" : "border-line text-ink",
      )}
    >
      {label}
    </button>
  );
}
