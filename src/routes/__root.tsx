import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { AppProviders } from "@/components/layout/providers";
import appCss from "../styles.css?url";

const APP_NAME = "DreamTable";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DreamTable — Come hungry. Leave talking." },
      { name: "description", content: "Bold Nigerian flavours, made fresh and delivered with love. Order, reserve, and track from DreamTable, Victoria Island, Lagos." },
      { name: "theme-color", content: "#D71920" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Allura&family=DM+Serif+Display:ital@0;1&family=Manrope:wght@400;500;600;700&display=swap",
      },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: () => (
    <html lang="en" suppressHydrationWarning className="antialiased">
      <head>
        <HeadContent />
      </head>
      <body className="bg-cream font-sans text-ink">
        <PreviewHostBridge />
        <AuthProvider>
          <AppProviders>
            <Outlet />
          </AppProviders>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center bg-cream px-6 text-center">
      <div>
        <p className="font-script text-7xl leading-none text-brand">Dream</p>
        <p className="mt-1 text-[11px] font-semibold tracking-[0.42em] text-brand">TABLE</p>
        <h1 className="mt-4 font-display text-4xl">Nothing matched that craving.</h1>
        <p className="mt-3 text-muted">Try our Signature Jollof, or head back home.</p>
        <a href="/" className="mt-8 inline-flex h-12 items-center bg-brand px-6 text-[11px] font-semibold tracking-label text-white">
          Back to the table
        </a>
      </div>
    </div>
  ),
});
