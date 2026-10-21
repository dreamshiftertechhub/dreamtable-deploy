import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

const LINKS = [
  { to: "/admin", label: "Service" },
  { to: "/admin/menu", label: "Menu" },
  { to: "/admin/reservations", label: "Reservations" },
  { to: "/admin/customers", label: "Guests" },
  { to: "/admin/analytics", label: "Numbers" },
] as const;

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-line bg-ink text-cream">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-8">
          <Link to="/admin" className="flex items-center gap-3" aria-label="DreamTable kitchen">
            <Logo />
            <span className="text-[11px] font-semibold tracking-label text-cream/70">Kitchen</span>
          </Link>
          <nav className="flex flex-wrap gap-5 text-[11px] font-semibold tracking-label">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "hover:text-brand",
                  pathname === l.to ? "text-brand" : "text-cream/70",
                )}
              >
                {l.label}
              </Link>
            ))}
            <Link to="/" className="text-cream/50 hover:text-cream">
              Front of house
            </Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <Outlet />
      </div>
    </div>
  );
}
