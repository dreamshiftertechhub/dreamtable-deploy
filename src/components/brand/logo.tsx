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
      <img
        src="/brand/mark.png"
        alt=""
        className={cn(
          "w-auto object-contain object-left",
          size === "nav" && "h-10 md:h-11",
          size === "footer" && "h-14",
          size === "lg" && "h-20",
        )}
      />
      <span className="flex flex-col items-start leading-none">
        <span
          className={cn(
            "font-brand tracking-tight",
            size === "nav" && "text-[1.35rem] md:text-[1.5rem]",
            size === "footer" && "text-3xl",
            size === "lg" && "text-4xl",
            onDark ? "text-white" : "text-ink",
          )}
        >
          DreamTable
        </span>
        <span
          className={cn(
            "font-sans font-semibold tracking-[0.38em] text-[0.55rem]",
            onDark ? "text-white/70" : "text-muted",
            size === "nav" && "mt-0.5",
            size === "footer" && "mt-1 text-[0.65rem]",
          )}
        >
          RESTAURANT
        </span>
      </span>
    </span>
  );
}

export function Mark({ className }: { className?: string }) {
  return <img src="/brand/mark.png" alt="DreamTable" className={cn("w-auto object-contain", className)} />;
}
