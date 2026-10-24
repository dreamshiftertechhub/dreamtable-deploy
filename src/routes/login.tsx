import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { rememberSessionToken } from "@/lib/remember-session";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): { next?: string } => ({
    next: typeof search.next === "string" ? search.next : undefined,
  }),
  component: LoginPage,
});

function LoginPage() {
  const next = Route.useSearch().next ?? "/account";
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      const path = mode === "up" ? "/api/auth/sign-up/email" : "/api/auth/sign-in/email";
      const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(mode === "up" ? { name, email, password } : { email, password }),
      });
      const data = (await res.json().catch(() => null)) as { token?: string; message?: string } | null;
      if (!res.ok) throw new Error(data?.message ?? "Those details didn't match.");
      rememberSessionToken(res.headers.get("set-auth-token") ?? data?.token);
      await authClient.getSession();
      void navigate({ to: next === "/admin" ? "/admin" : "/account" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-cream px-4 py-16">
      <div className="w-full max-w-md">
        <Link to="/" aria-label="DreamTable home">
          <Logo size="lg" />
        </Link>
        <h1 className="mt-8 font-display text-5xl">{mode === "in" ? "Welcome back." : "Take a seat."}</h1>
        <p className="mt-3 text-sm text-muted">
          Guests keep their orders and favourites. The owner and staff use the same door for the kitchen.
        </p>

        {!authEnabled ? (
          <p className="mt-8 text-sm text-muted">Sign-in is turned off.</p>
        ) : (
          <>
            <form className="mt-8 space-y-4" onSubmit={onSubmit}>
              {mode === "up" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-brand">{error}</p>}
              <Button type="submit" size="lg" className="w-full" disabled={pending}>
                {pending ? "One moment…" : mode === "in" ? "Sign in" : "Create account"}
              </Button>
            </form>
            {mode === "in" && <Link to="/forgot-password" className="mt-4 block text-sm text-muted underline underline-offset-4">Forgot password?</Link>}
            <button
              type="button"
              className="mt-4 text-sm text-muted underline-offset-4 hover:underline"
              onClick={() => {
                setMode(mode === "in" ? "up" : "in");
                setError("");
              }}
            >
              {mode === "in" ? "New here? Create an account" : "Already have a seat? Sign in"}
            </button>
            <div className="mt-8 space-y-2">
              {GROK_PROVIDERS.map((p) => (
                <button
                  key={p.providerId}
                  type="button"
                  className="h-12 w-full border border-line bg-paper text-[11px] font-semibold tracking-label"
                  onClick={() => void signIn(p.providerId, { callbackURL: next === "/admin" ? "/admin" : "/account" })}
                >
                  Continue with {p.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
