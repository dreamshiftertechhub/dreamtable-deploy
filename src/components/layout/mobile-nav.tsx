import { Link, useRouterState } from "@tanstack/react-router";
import { Home, UtensilsCrossed, Receipt, User } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/menu", label: "Menu", icon: UtensilsCrossed },
  { to: "/account", label: "Orders", icon: Receipt, hash: "orders" },
  { to: "/account", label: "Account", icon: User },
] as const;

export function MobileNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname.startsWith("/admin")) return null;
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Mobile tabs"
    >
      <ul className="grid grid-cols-4">
        {ITEMS.map((item) => {
          const active =
            item.label === "Home"
              ? pathname === "/"
              : item.label === "Menu"
                ? pathname.startsWith("/menu") || pathname.startsWith("/order")
                : item.label === "Orders"
                  ? pathname.startsWith("/track") || pathname.startsWith("/confirmation")
                  : pathname.startsWith("/account") || pathname.startsWith("/loyalty");
          const Icon = item.icon;
          return (
            <li key={item.label}>
              <Link
                to={item.to}
                className={cn(
                  "flex h-14 flex-col items-center justify-center gap-1 text-[10px] font-semibold tracking-label",
                  active ? "text-brand" : "text-muted",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
