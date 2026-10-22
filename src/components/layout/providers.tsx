import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";
import { useMimi } from "@/store/use-mimi";
import { CartDrawer } from "./cart-drawer";
import { SearchOverlay } from "./search-overlay";
import { FoodModal } from "@/components/food/food-modal";

export function AppProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    const result = useMimi.persist.rehydrate();
    void Promise.resolve(result).then(() => {
      useMimi.getState().flushPendingAdds();
    });
  }, []);

  return (
    <>
      {children}
      <CartDrawer />
      <SearchOverlay />
      <FoodModal />
      <Toaster
        position="top-center"
        toastOptions={{
          className: "!bg-ink !text-cream !border-0 !rounded-none !font-sans !text-sm",
        }}
      />
    </>
  );
}
