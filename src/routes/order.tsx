import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { MenuExperience } from "@/components/food/menu-experience";

export const Route = createFileRoute("/order")({ component: OrderPage });

function OrderPage() {
  return (
    <SiteShell>
      <MenuExperience kicker="Order" title="Send it to the kitchen." />
    </SiteShell>
  );
}
