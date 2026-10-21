import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

const FALLBACK_MESSAGE = "Something went wrong. Let's try that again.";

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return FALLBACK_MESSAGE;
}

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream px-6 text-center text-ink">
      <span className="text-brand" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={2} />
      </span>
      <h1 className="font-display text-3xl">Something went wrong.</h1>
      <p className="max-w-md text-sm break-words text-muted">{errorMessage(error)}</p>
      <a
        href="/"
        className="mt-4 inline-flex h-11 items-center bg-brand px-5 text-[11px] font-semibold tracking-label text-white"
      >
        Let's try that again
      </a>
    </main>
  );
}
