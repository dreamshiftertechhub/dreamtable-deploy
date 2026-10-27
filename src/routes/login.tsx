import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (mode === "up" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
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
        <Link to="/" aria-label="RealMeal home">
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
              <Button type="submit" size="lg" className="w-full" disabled={pending || (mode === "up" && password !== confirmPassword)}>
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
                setPassword("");
                setConfirmPassword("");
                setShowPassword(false);
                setShowConfirmPassword(false);
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
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} minLength={8} autoComplete={mode === "up" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} required className="pr-12" />
                  <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword((v) => !v)} className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted hover:text-ink">
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              {mode === "up" && (
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm password</Label>
                  <div className="relative">
                    <Input id="confirm-password" type={showConfirmPassword ? "text" : "password"} minLength={8} autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="pr-12" aria-invalid={Boolean(confirmPassword && password !== confirmPassword)} />
                    <button type="button" aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"} aria-pressed={showConfirmPassword} onClick={() => setShowConfirmPassword((v) => !v)} className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted hover:text-ink">
                      {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && <p className="text-sm text-brand" role="alert">Passwords do not match.</p>}
                </div>
              )}
              {error && <p className="text-sm text-brand">{error}</p>}
              <Button type="submit" size="lg" className="w-full" disabled={pending || (mode === "up" && password !== confirmPassword)}>
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
                setPassword("");
                setConfirmPassword("");
                setShowPassword(false);
                setShowConfirmPassword(false);
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