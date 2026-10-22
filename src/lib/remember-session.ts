const BEARER_KEY = "grok-auth.bearer-token";

/** Preview iframes can't read the session cookie, so keep the token the client already uses. */
export function rememberSessionToken(token: string | null | undefined) {
  if (typeof window === "undefined" || !token) return;
  try {
    window.sessionStorage.setItem(BEARER_KEY, token);
  } catch {
    /* ignore */
  }
}
