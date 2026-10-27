import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = "nav",
  onDark = false,
}: {
  className?: string;
  size?: "nav" | "footer" | "lg";
  onDark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span aria-hidden="true" className={cn("grid shrink-0 place-items-center border border-current font-brand font-bold tracking-[-0.1em] text-[#C6A667]", size === "nav" && "size-9 text-xl md:size-11", size === "footer" && "size-14 text-3xl", size === "lg" && "size-20 text-5xl")}>R</span>
      <span className="flex flex-col items-start leading-none">
        <span
          className={cn(
            "font-brand tracking-tight",
            size === "nav" && "text-lg md:text-[1.5rem]",
            size === "footer" && "text-3xl",
            size === "lg" && "text-4xl",
            onDark ? "text-white" : "text-ink",
          )}
        >
          RealMeal
        </span>
        <span
          className={cn(
            "hidden font-sans font-semibold tracking-[0.38em] text-[0.55rem] sm:block",
            onDark ? "text-white/70" : "text-muted",
            size === "nav" && "mt-0.5",
            size === "footer" && "mt-1 text-[0.65rem]",
          )}
        >
          REAL FOOD
        </span>
      </span>
    </span>
  );
}

export function Mark({ className }: { className?: string }) {
  return <span role="img" aria-label="RealMeal" className={cn("inline-grid size-10 place-items-center border border-[#C6A667] font-brand text-2xl font-bold text-[#C6A667]", className)}>R</span>;
}
