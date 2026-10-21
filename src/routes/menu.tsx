import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { MenuExperience } from "@/components/food/menu-experience";

export const Route = createFileRoute("/menu")({ component: MenuPage });

function MenuPage() {
  return (
    <SiteShell>
      <MenuExperience kicker="The menu" title="What are you in the mood for?" />
    </SiteShell>
  );
}
