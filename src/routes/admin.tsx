import { useEffect, useState } from "react";
import { createFileRoute, Link, Navigate, Outlet, useRouterState } from "@tanstack/react-router";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { claimHouse, getMySeat, type Seat } from "@/lib/house.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

const LINKS = [
  { to: "/admin", label: "Orders" },
  { to: "/admin/menu", label: "Menu" },
  { to: "/admin/reservations", label: "Reservations" },
  { to: "/admin/customers", label: "Guests" },
  { to: "/admin/analytics", label: "Numbers" },
  { to: "/admin/staff", label: "Staff" },
] as const;

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, isPending } = useCurrentUserState();
  const [seat, setSeat] = useState<Seat | null | undefined>(undefined);
  const [error, setError] = useState("");
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (isPending || !user) return;
    let live = true;
    void getMySeat()
      .then((next) => {
        if (live) setSeat(next);
      })
      .catch(() => {
        if (live) setSeat(null);
      });
    return () => {
      live = false;
    };
  }, [isPending, user]);

  if (isPending || (user && seat === undefined)) {
    return <div className="grid min-h-screen place-items-center bg-cream text-muted">Checking the keys…</div>;
  }
  if (!user) return <Navigate to="/login" search={{ next: "/admin" }} />;

  if (!seat) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream px-6">
        <div className="max-w-md">
          <Logo />
          <h1 className="mt-8 font-display text-5xl">The kitchen is locked.</h1>
          <p className="mt-4 text-muted">
            Owner and staff access must be provisioned securely. Public registration does not grant administrator access.
          </p>
          {error && <p className="mt-4 text-sm text-brand">{error}</p>}
          {import.meta.env.DEV && <Button
            className="mt-8"
            disabled={claiming}
            onClick={() => {
              setClaiming(true);
              setError("");
              void claimHouse()
                .then((result) => {
                  if (!result.ok) setError(result.error);
                  else setSeat(result.seat);
                })
                .catch(() => setError("Could not open the house."))
                .finally(() => setClaiming(false));
            }}
          >
            {claiming ? "Opening…" : "Take the keys"}
          </Button>}
        </div>
      </div>
    );
  }

  const links = LINKS.filter((l) => l.to !== "/admin/staff" || seat.role === "owner");

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-line bg-ink text-cream">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-8">
          <Link to="/admin" className="flex items-center gap-3" aria-label="RealMeal administration">
            <Logo onDark />
            <span className="text-[11px] font-semibold tracking-label text-cream/70">
              {seat.role === "owner" ? "Owner" : seat.role}
            </span>
          </Link>
          <nav className="flex flex-wrap gap-5 text-[11px] font-semibold tracking-label">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={cn("hover:text-brand", pathname === l.to ? "text-brand" : "text-cream/70")}
              >
                {l.label}
              </Link>
            ))}
            <Link to="/" className="text-cream/50 hover:text-cream">
              Front of house
            </Link>
          </nav>
          <UserButton />
        </div>
      </header>
      <div className="mx-auto max-w-[90rem] px-4 py-10 md:px-8">
        <Outlet />
      </div>
    </div>
  );
}
