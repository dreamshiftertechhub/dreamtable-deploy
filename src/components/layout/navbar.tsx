import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";
import { useCartCount } from "@/store/use-mimi";
import { useUi } from "@/store/use-ui";

const LINKS = [
  { to: "/menu", label: "Menu" },
  { to: "/order", label: "Order" },
  { to: "/reservations", label: "Reservations" },
  { to: "/catering", label: "Catering" },
  { to: "/story", label: "Our Story" },
] as const;

const MORE = [
  { to: "/track", label: "Track order" },
  { to: "/admin", label: "Kitchen" },
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
  const { user, isPending } = useCurrentUserState();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobile(false);
  }, [pathname, setMobile]);

  const darkBar = overlay && !mobileOpen;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-[background-color,color,border-color,backdrop-filter] duration-300",
          darkBar && scrolled && "border-b border-white/10 bg-ink/85 text-white backdrop-blur-md",
          darkBar && !scrolled && "border-b border-transparent bg-transparent text-white",
          !darkBar && "border-b border-line bg-cream/95 text-ink",
        )}
      >
        <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-6 px-4 md:h-[4.75rem] md:px-8">
          <Link to="/" className="flex items-center" aria-label="DreamTable home">
            <Logo onDark={darkBar} />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "text-[13px] font-semibold tracking-[0.18em] uppercase underline-offset-8 transition-colors hover:underline hover:decoration-brand",
                  pathname === l.to && "underline decoration-brand",
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <IconBtn label="Search" onClick={() => setSearch(true)}>
              <Search className="size-[18px]" />
            </IconBtn>
            {!isPending && !user ? (
              <Link to="/login" className="px-2 text-[11px] font-semibold tracking-label">
                Sign in
              </Link>
            ) : (
              <Link to="/account" aria-label="Account" className="grid size-11 place-items-center">
                <User className="size-[18px]" />
              </Link>
            )}
            <Link to="/admin" className="hidden px-2 text-[11px] font-semibold tracking-label sm:inline">
              Kitchen
            </Link>
            <button
              type="button"
              aria-label={`Cart, ${count} items`}
              onClick={() => setCart(true)}
              className="relative grid size-11 place-items-center"
            >
              <ShoppingBag className={cn("size-[18px]", pulse > 0 && "origin-center")} />
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
              {mobileOpen ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 overflow-y-auto bg-cream px-5 pb-28 pt-[4.5rem] text-ink">
          <nav className="mx-auto flex max-w-md flex-col" aria-label="Mobile">
            {[...LINKS, ...MORE].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="border-b border-line py-3.5 text-lg font-medium"
              >
                {l.label}
              </Link>
            ))}
            <Link to={user ? "/account" : "/login"} className="border-b border-line py-3.5 text-lg font-medium">
              {user ? "Account" : "Sign in"}
            </Link>
            <Link to="/build" className="py-3.5 text-lg font-medium text-brand">
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
