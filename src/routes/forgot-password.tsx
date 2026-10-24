import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/logo";

export const Route = createFileRoute("/forgot-password")({ component: ForgotPassword });

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true); setError("");
    try {
      const response = await fetch("/api/auth/request-password-reset", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, redirectTo: "/reset-password" }),
      });
      if (!response.ok) throw new Error("Unable to request a reset right now. Please try again later.");
      setSent(true);
    } catch (err) { setError(err instanceof Error ? err.message : "Please try again."); }
    finally { setPending(false); }
  }
  return <main className="grid min-h-screen place-items-center bg-cream px-4 py-16">
    <div className="w-full max-w-md"><Link to="/"><Logo size="lg" /></Link>
      <h1 className="mt-8 font-display text-4xl">Reset your password.</h1>
      {sent ? <p className="mt-5 text-muted" role="status">If this address has an account, a recovery email will arrive shortly. Check your inbox and spam folder.</p> :
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label htmlFor="reset-email" className="block text-sm font-semibold">Account email</label>
        <input id="reset-email" type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className="h-12 w-full min-w-0 border border-line bg-paper px-3" />
        {error && <p role="alert" className="text-sm text-brand">{error}</p>}
        <button disabled={pending} className="h-12 w-full bg-brand px-5 font-semibold text-white disabled:opacity-60">{pending ? "Sending…" : "Send reset link"}</button>
      </form>}
      <Link to="/login" className="mt-6 inline-block text-sm underline underline-offset-4">Back to sign in</Link>
    </div></main>;
}
