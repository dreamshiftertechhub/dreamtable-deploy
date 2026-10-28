/** Buyer-facing settings. Demo mode stays on until the owner confirms every launch requirement. */
export const RESTAURANT_CONFIG = {
  name: "RealMeal",
  tagline: "Real Food. Real Satisfaction.",
  mode: "demo" as "demo" | "live",
  location: "4 Agbele, Iyana Ipaja, Lagos State, Nigeria",
  dineInAvailable: true,
  publishLocation: true,
  initialDeliveryArea: "Selected areas of Lekki and Ajah, Lagos",
  futureExpansion: "Ogun State",
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
