/**
 * Password-reset delivery. Configure RESEND_API_KEY and a verified
 * DREAMTABLE_EMAIL_FROM sender in deployment secrets. Never commit API keys.
 * The Gmail address is the administrative reply-to/notification inbox; Resend
 * cannot send FROM an unverified gmail.com address.
 */
export async function sendPasswordResetEmail(recipient: string, resetUrl: string): Promise<void> {
  const key = process.env.RESEND_API_KEY?.trim();
  const from = process.env.DREAMTABLE_EMAIL_FROM?.trim();
  if (!key || !from) {
    throw new Error("Password recovery email is not configured");
  }
  const url = new URL(resetUrl);
  if (url.protocol !== "https:" && !(url.hostname === "localhost" && url.protocol === "http:")) {
    throw new Error("Invalid password reset URL");
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [recipient],
      subject: "Reset your RealMeal password",
      text: `We received a request to reset your RealMeal password. Open this link within one hour: ${url.toString()}\n\nIf you did not request this, ignore this email.\n\nIf you need help, contact the restaurant through its official channel.`,
    }),
  });
  if (!response.ok) {
    // Do not log the reset URL, recipient, or API credentials.
    throw new Error(`Password reset email delivery failed (HTTP ${response.status})`);
  }
}
