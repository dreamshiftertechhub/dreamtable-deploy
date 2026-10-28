import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/logo";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: Record<string, unknown>): { token?: string } => ({
    token: typeof search.token === "string" ? search.token : undefined,
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const { token } = Route.useSearch();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault(); setError("");
    if (!token) { setError("This reset link is invalid. Request another."); return; }
    if (password.length < 8) { setError("Use at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setPending(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      if (!response.ok) throw new Error("This link is invalid or expired. Request another.");
      setDone(true); setPassword(""); setConfirm("");
    } catch (err) { setError(err instanceof Error ? err.message : "Reset failed."); }
    finally { setPending(false); }
  }
  return <main className="grid min-h-screen place-items-center bg-cream px-4 py-16"><div className="w-full max-w-md">
    <Link to="/"><Logo size="lg" /></Link><h1 className="mt-8 font-display text-4xl">Choose a new password.</h1>
    {done ? <p className="mt-5" role="status">Your password has been updated. <Link to="/login" className="underline">Sign in</Link></p> :
    <form onSubmit={submit} className="mt-6 space-y-4">
      <label htmlFor="new-password" className="block text-sm font-semibold">New password</label>
      <input id="new-password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={e => setPassword(e.target.value)} className="h-12 w-full border border-line bg-paper px-3" />
      <label htmlFor="confirm-password" className="block text-sm font-semibold">Confirm new password</label>
      <input id="confirm-password" type="password" autoComplete="new-password" minLength={8} required value={confirm} onChange={e => setConfirm(e.target.value)} className="h-12 w-full border border-line bg-paper px-3" />
      {error && <p role="alert" className="text-sm text-brand">{error}</p>}
      <button disabled={pending || !token} className="h-12 w-full bg-brand px-5 font-semibold text-white disabled:opacity-60">{pending ? "Updating…" : "Update password"}</button>
    </form>}
    <Link to="/forgot-password" className="mt-6 inline-block text-sm underline underline-offset-4">Request a new link</Link>
  </div></main>;
}
