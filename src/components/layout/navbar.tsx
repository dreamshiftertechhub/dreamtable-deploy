import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { useCartCount } from "@/store/use-mimi";
import { useUi } from "@/store/use-ui";

const LINKS = [
  { to: "/menu", label: "Menu" },
  { to: "/order", label: "Order" },
  { to: "/reservations", label: "Reservations" },
  { to: "/story", label: "Our Story" },
  { to: "/track", label: "Track Order" },
] as const;

export function Navbar({ overlay = false }: { overlay?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const count = useCartCount();
  const pulse = useUi((s) => s.cartPulse);
  const setCart = useUi((s) => s.setCartOpen);
  const setSearch = useUi((s) => s.setSearchOpen);
  const mobileOpen = useUi((s) => s.mobileMenuOpen);
  const setMobile = useUi((s) => s.setMobileMenuOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobile(false);
  }, [pathname, setMobile]);

  const solid = !overlay || scrolled || mobileOpen;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-[background-color,color,border-color] duration-300",
          solid ? "border-b border-line bg-cream/95 text-ink" : "border-b border-transparent text-white",
        )}
      >
        <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-4 px-4 md:h-[4.75rem] md:px-8">
          <Link to="/" className="flex items-center" aria-label="DreamTable home">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "text-[11px] font-semibold tracking-label transition-opacity hover:opacity-70",
                  pathname === l.to && "opacity-100",
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-0.5">
            <IconBtn label="Search" onClick={() => setSearch(true)}>
              <Search className="size-4" />
            </IconBtn>
            <Link to="/account" aria-label="Account" className="grid size-11 place-items-center">
              <User className="size-4" />
            </Link>
            <button
              type="button"
              aria-label={`Cart, ${count} items`}
              onClick={() => setCart(true)}
              className="relative grid size-11 place-items-center"
            >
              <ShoppingBag className={cn("size-4", pulse > 0 && "origin-center")} />
              {count > 0 && (
                <span
                  key={pulse}
                  className="absolute right-1.5 top-1.5 grid size-4 place-items-center bg-brand text-[9px] font-bold text-white"
                >
                  {count}
                </span>
              )}
            </button>
            <button
              type="button"
              className="grid size-11 place-items-center lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobile(!mobileOpen)}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 flex flex-col bg-cream px-6 pt-24 text-ink">
          <nav className="flex flex-col gap-2" aria-label="Mobile">
            {LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="border-b border-line py-4 font-display text-4xl">
                {l.label}
              </Link>
            ))}
            <Link to="/account" className="border-b border-line py-4 font-display text-4xl">
              Account
            </Link>
            <Link to="/build" className="py-4 font-display text-4xl text-brand">
              Build your plate
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}

function IconBtn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="grid size-11 place-items-center">
      {children}
    </button>
  );
}
