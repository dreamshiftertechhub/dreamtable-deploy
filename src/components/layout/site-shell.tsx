import type { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { MobileNav } from "./mobile-nav";

export function SiteShell({
  children,
  overlayNav = false,
  footer = true,
}: {
  children: ReactNode;
  overlayNav?: boolean;
  footer?: boolean;
}) {
  return (
    <div className="min-h-screen bg-cream pb-16 md:pb-0">
      <Navbar overlay={overlayNav} />
      <main>{children}</main>
      {footer && <Footer />}
      <MobileNav />
    </div>
  );
}
