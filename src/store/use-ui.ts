import { create } from "zustand";

interface UiState {
  cartOpen: boolean;
  searchOpen: boolean;
  foodId: string | null;
  mobileMenuOpen: boolean;
  cartPulse: number;
  setCartOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  openFood: (id: string) => void;
  closeFood: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  pulseCart: () => void;
}

export const useUi = create<UiState>((set) => ({
  cartOpen: false,
  searchOpen: false,
  foodId: null,
  mobileMenuOpen: false,
  cartPulse: 0,
  setCartOpen: (open) => set({ cartOpen: open }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  openFood: (id) => set({ foodId: id, searchOpen: false, mobileMenuOpen: false }),
  closeFood: () => set({ foodId: null }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  pulseCart: () => set((s) => ({ cartPulse: s.cartPulse + 1 })),
}));
