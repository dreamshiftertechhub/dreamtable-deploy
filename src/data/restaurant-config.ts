/** Buyer-facing settings. Demo mode stays on until the owner confirms every launch requirement. */
export const RESTAURANT_CONFIG = {
  name: "DreamTable",
  tagline: "Bold Nigerian-inspired dining",
  mode: "demo" as "demo" | "live",
  location: "",
  phone: "",
  whatsapp: "",
  email: "",
  openingHours: "",
  currency: "NGN",
  menuPricesAreExamples: true,
  // These are independent gates: changing mode alone must NEVER activate payments.
  orderingEnabled: false,
  reservationsEnabled: false,
  cateringEnabled: false,
  paymentsEnabled: false,
} as const;

export const IS_DEMO = RESTAURANT_CONFIG.mode === "demo";
