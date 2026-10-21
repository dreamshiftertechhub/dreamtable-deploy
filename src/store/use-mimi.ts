import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { MENU } from "@/data/menu";
import {
  DEFAULT_ADDRESSES,
  DEFAULT_PROFILE,
  SEED_LOYALTY,
  SEED_ORDERS,
  SEED_RESERVATIONS,
} from "@/data/seeds";
import type {
  Address,
  CartLine,
  ExtraId,
  Fulfillment,
  LoyaltyEvent,
  MenuItem,
  Order,
  OrderCustomer,
  OrderStatus,
  PaymentMethod,
  Profile,
  Promo,
  Reservation,
  ReservationStatus,
} from "@/data/types";
import {
  DELIVERY_FEE,
  EXTRAS,
  FREE_DELIVERY_OVER,
  PROMOS,
} from "@/data/types";
import { useUi } from "./use-ui";

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function nextOrderId(existing: Order[]) {
  const nums = existing.map((o) => Number(o.id.replace(/^(DT|MIMI)/, ""))).filter((n) => !Number.isNaN(n));
  const n = Math.max(2847, ...nums) + 1;
  return `DT${n}`;
}

function nextReservationId(existing: Reservation[]) {
  const nums = existing.map((o) => Number(o.id.replace(/^(DT|MIMI)/, ""))).filter((n) => !Number.isNaN(n));
  const n = Math.max(4812, ...nums) + 1;
  return `DT${n}`;
}

export function lineTotal(line: CartLine) {
  return line.unitPrice * line.quantity;
}

export function cartSubtotal(cart: CartLine[]) {
  return cart.reduce((sum, line) => sum + lineTotal(line), 0);
}

function mergeCart(cart: CartLine[], line: Omit<CartLine, "lineId">): CartLine[] {
  const twin = cart.find(
    (c) =>
      c.menuItemId === line.menuItemId &&
      c.protein === line.protein &&
      c.spice === line.spice &&
      c.notes === line.notes &&
      c.customLabel === line.customLabel &&
      c.extras.slice().sort().join() === line.extras.slice().sort().join(),
  );
  if (twin) {
    return cart.map((c) =>
      c.lineId === twin.lineId ? { ...c, quantity: c.quantity + line.quantity } : c,
    );
  }
  return [...cart, { ...line, lineId: uid("line") }];
}

export function extraCost(extras: ExtraId[]) {
  return extras.reduce((sum, id) => sum + (EXTRAS.find((e) => e.id === id)?.price ?? 0), 0);
}

export function applyPromo(subtotal: number, promo?: Promo | null) {
  if (!promo) return 0;
  if (promo.type === "percent") return Math.round(subtotal * (promo.value / 100));
  return Math.min(subtotal, promo.value);
}

export function deliveryFeeFor(subtotal: number, fulfillment: Fulfillment) {
  if (fulfillment === "pickup") return 0;
  if (subtotal >= FREE_DELIVERY_OVER) return 0;
  return DELIVERY_FEE;
}

export interface CheckoutDraft {
  customer: OrderCustomer;
  fulfillment: Fulfillment;
  payment: PaymentMethod;
}

export type MembershipPlan = "none" | "table" | "host";

interface MimiState {
  hydrated: boolean;
  items: MenuItem[];
  cart: CartLine[];
  pendingAdds: Omit<CartLine, "lineId">[];
  promoCode: string | null;
  promoError: string | null;
  favouriteIds: string[];
  orders: Order[];
  reservations: Reservation[];
  profile: Profile;
  addresses: Address[];
  points: number;
  loyaltyHistory: LoyaltyEvent[];
  discountCredit: number;
  membership: MembershipPlan;
  setHydrated: (v: boolean) => void;
  flushPendingAdds: () => void;
  addToCart: (line: Omit<CartLine, "lineId">) => void;
  setQty: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  clearCart: () => void;
  applyCode: (code: string) => boolean;
  clearPromo: () => void;
  toggleFavourite: (id: string) => void;
  placeOrder: (draft: CheckoutDraft) => Order;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  tickOrders: () => void;
  addReservation: (r: Omit<Reservation, "id" | "status" | "createdAt">) => Reservation;
  updateReservation: (id: string, status: ReservationStatus) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  addAddress: (a: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
  redeemReward: (id: string) => string | null;
  subscribe: (plan: MembershipPlan) => void;
  buyGiftCard: (amount: number) => void;
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (id: string, patch: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
}

const STATUS_FLOW: OrderStatus[] = [
  "new",
  "confirmed",
  "preparing",
  "ready",
  "out-for-delivery",
  "delivered",
];

export const useMimi = create<MimiState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      items: MENU,
      cart: [],
      pendingAdds: [],
      promoCode: null,
      promoError: null,
      favouriteIds: ["signature-jollof", "suya-fries"],
      orders: SEED_ORDERS,
      reservations: SEED_RESERVATIONS,
      profile: DEFAULT_PROFILE,
      addresses: DEFAULT_ADDRESSES,
      points: 1240,
      loyaltyHistory: SEED_LOYALTY,
      discountCredit: 0,
      membership: "none",
      setHydrated: (v) => set({ hydrated: v }),
      flushPendingAdds: () =>
        set((s) => {
          let cart = s.cart;
          for (const line of s.pendingAdds) cart = mergeCart(cart, line);
          return { hydrated: true, pendingAdds: [], cart };
        }),
      addToCart: (line) => {
        if (!get().hydrated) {
          set((s) => ({ pendingAdds: [...s.pendingAdds, line] }));
          useUi.getState().pulseCart();
          return;
        }
        set((s) => ({ cart: mergeCart(s.cart, line) }));
        useUi.getState().pulseCart();
      },
      setQty: (lineId, quantity) =>
        set((s) => ({
          cart:
            quantity <= 0
              ? s.cart.filter((c) => c.lineId !== lineId)
              : s.cart.map((c) => (c.lineId === lineId ? { ...c, quantity } : c)),
        })),
      removeLine: (lineId) => set((s) => ({ cart: s.cart.filter((c) => c.lineId !== lineId) })),
      clearCart: () => set({ cart: [], promoCode: null, promoError: null }),
      applyCode: (code) => {
        const found = PROMOS.find((p) => p.code.toLowerCase() === code.trim().toLowerCase());
        if (!found) {
          set({ promoError: "That code doesn't exist.", promoCode: null });
          return false;
        }
        set({ promoCode: found.code, promoError: null });
        return true;
      },
      clearPromo: () => set({ promoCode: null, promoError: null }),
      toggleFavourite: (id) =>
        set((s) => ({
          favouriteIds: s.favouriteIds.includes(id)
            ? s.favouriteIds.filter((x) => x !== id)
            : [...s.favouriteIds, id],
        })),
      placeOrder: (draft) => {
        const { cart, promoCode, discountCredit, orders, points } = get();
        const subtotal = cartSubtotal(cart);
        const promo = PROMOS.find((p) => p.code === promoCode) ?? null;
        const discount = applyPromo(subtotal, promo) + discountCredit;
        const deliveryFee = deliveryFeeFor(subtotal, draft.fulfillment);
        const total = Math.max(0, subtotal + deliveryFee - discount);
        const earned = Math.round(total / 100);
        const order: Order = {
          id: nextOrderId(orders),
          items: cart,
          status: "confirmed",
          fulfillment: draft.fulfillment,
          customer: draft.customer,
          payment: draft.payment,
          subtotal,
          deliveryFee,
          discount,
          total,
          promoCode: promo?.code,
          createdAt: new Date().toISOString(),
          etaMinutes: draft.fulfillment === "pickup" ? 18 : 28,
          rider:
            draft.fulfillment === "delivery"
              ? { name: "Daniel", vehicle: "Motorbike", phone: "+234 809 221 0044" }
              : undefined,
          pointsEarned: earned,
        };
        set({
          orders: [order, ...orders],
          cart: [],
          promoCode: null,
          promoError: null,
          discountCredit: 0,
          points: points + earned,
          loyaltyHistory: [
            {
              id: uid("loy"),
              label: `Order #${order.id}`,
              points: earned,
              at: order.createdAt,
            },
            ...get().loyaltyHistory,
          ],
        });
        return order;
      },
      updateOrderStatus: (id, status) =>
        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
      tickOrders: () =>
        set((s) => ({
          orders: s.orders.map((o) => {
            if (o.status === "delivered" || o.status === "cancelled") return o;
            const elapsed = (Date.now() - new Date(o.createdAt).getTime()) / 1000;
            let next: OrderStatus = o.status;
            if (elapsed > 12) next = "confirmed";
            if (elapsed > 25) next = "preparing";
            if (elapsed > 55) next = "ready";
            if (elapsed > 75 && o.fulfillment === "delivery") next = "out-for-delivery";
            if (elapsed > 140) next = "delivered";
            if (elapsed > 90 && o.fulfillment === "pickup") next = "delivered";
            const flow = STATUS_FLOW.indexOf(next);
            const cur = STATUS_FLOW.indexOf(o.status);
            if (flow > cur) return { ...o, status: next };
            return o;
          }),
        })),
      addReservation: (r) => {
        const reservation: Reservation = {
          ...r,
          id: nextReservationId(get().reservations),
          status: "confirmed",
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ reservations: [reservation, ...s.reservations] }));
        return reservation;
      },
      updateReservation: (id, status) =>
        set((s) => ({
          reservations: s.reservations.map((r) => (r.id === id ? { ...r, status } : r)),
        })),
      updateProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),
      addAddress: (a) =>
        set((s) => ({ addresses: [...s.addresses, { ...a, id: uid("addr") }] })),
      removeAddress: (id) =>
        set((s) => ({ addresses: s.addresses.filter((a) => a.id !== id) })),
      redeemReward: (id) => {
        const reward = (
          [
            { id: "drink", label: "Free drink", points: 500 },
            { id: "side", label: "Free side", points: 1500 },
            { id: "discount", label: "₦2,000 discount", points: 2500 },
            { id: "meal", label: "Free main meal", points: 5000 },
          ] as const
        ).find((r) => r.id === id);
        if (!reward) return "That reward isn't available.";
        if (get().points < reward.points) return "You need a few more points.";
        set((s) => ({
          points: s.points - reward.points,
          discountCredit: s.discountCredit + (reward.id === "discount" ? 2000 : 0),
          loyaltyHistory: [
            {
              id: uid("loy"),
              label: `Redeemed ${reward.label}`,
              points: -reward.points,
              at: new Date().toISOString(),
            },
            ...s.loyaltyHistory,
          ],
        }));
        if (reward.id === "drink") {
          get().addToCart({
            menuItemId: "chapman",
            name: "Chapman (reward)",
            image: "/food/hero.jpg",
            unitPrice: 0,
            quantity: 1,
            extras: [],
            customLabel: "Loyalty reward",
          });
        }
        if (reward.id === "side") {
          get().addToCart({
            menuItemId: "dodo",
            name: "Fried Plantain (reward)",
            image: "/food/ofada.jpg",
            unitPrice: 0,
            quantity: 1,
            extras: [],
            customLabel: "Loyalty reward",
          });
        }
        if (reward.id === "meal") {
          get().addToCart({
            menuItemId: "signature-jollof",
            name: "DreamTable Signature Jollof (reward)",
            image: "/food/jollof.jpg",
            unitPrice: 0,
            quantity: 1,
            extras: [],
            customLabel: "Loyalty reward",
          });
        }
        return null;
      },
      subscribe: (plan) => {
        if (plan === "none") {
          set({ membership: "none" });
          return;
        }
        const bonus = plan === "host" ? 800 : 250;
        set((s) => ({
          membership: plan,
          points: s.points + bonus,
          loyaltyHistory: [
            {
              id: uid("loy"),
              label: plan === "host" ? "Joined Host membership" : "Joined The Circle",
              points: bonus,
              at: new Date().toISOString(),
            },
            ...s.loyaltyHistory,
          ],
        }));
      },
      buyGiftCard: (amount) =>
        set((s) => ({
          discountCredit: s.discountCredit + amount,
          loyaltyHistory: [
            {
              id: uid("loy"),
              label: `Gift card ${amount.toLocaleString("en-NG")}`,
              points: 0,
              at: new Date().toISOString(),
            },
            ...s.loyaltyHistory,
          ],
        })),
      addMenuItem: (item) => set((s) => ({ items: [item, ...s.items] })),
      updateMenuItem: (id, patch) =>
        set((s) => ({
          items: s.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
        })),
      deleteMenuItem: (id) => set((s) => ({ items: s.items.filter((it) => it.id !== id) })),
    }),
    {
      name: "dreamtable-v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({
        items: s.items,
        cart: s.cart,
        promoCode: s.promoCode,
        favouriteIds: s.favouriteIds,
        orders: s.orders,
        reservations: s.reservations,
        profile: s.profile,
        addresses: s.addresses,
        points: s.points,
        loyaltyHistory: s.loyaltyHistory,
        discountCredit: s.discountCredit,
        membership: s.membership,
      }),
    },
  ),
);

export function useCartCount() {
  return useMimi((s) => s.cart.reduce((n, l) => n + l.quantity, 0));
}

export function useActivePromo() {
  const code = useMimi((s) => s.promoCode);
  return PROMOS.find((p) => p.code === code) ?? null;
}
