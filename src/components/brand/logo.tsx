import { cn } from "@/lib/utils";

/** RealMeal: a clean plate-and-cutlery mark, shared by header, footer and auth pages. */
function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className={cn("shrink-0 text-[#C6A667]", className)}>
      <circle cx="32" cy="32" r="27" stroke="currentColor" strokeWidth="2.5" />
      <path d="M18 16v13c0 4 2 6 5 6v13M23 16v19M28 16v13c0 4-2 6-5 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M43 16c-7 5-10 12-10 21h10V16Zm0 0v32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
      <BrandMark className={cn(size === "nav" && "size-10 md:size-11", size === "footer" && "size-14", size === "lg" && "size-20")} />
      <span className="flex flex-col items-start leading-none">
        <span className={cn("font-sans font-extrabold tracking-[-0.055em]", size === "nav" && "text-xl md:text-2xl", size === "footer" && "text-3xl", size === "lg" && "text-4xl", onDark ? "text-white" : "text-ink")}>RealMeal</span>
        <span className={cn("mt-1 font-sans text-[0.55rem] font-semibold uppercase tracking-[0.19em] sm:text-[0.6rem]", onDark ? "text-white/70" : "text-muted")}>Real Food. Real Satisfaction.</span>
      </span>
    </span>
  );
}

export function Mark({ className }: { className?: string }) {
  return <span role="img" aria-label="RealMeal" className={cn("inline-grid size-10 place-items-center", className)}><BrandMark className="size-full" /></span>;
}
