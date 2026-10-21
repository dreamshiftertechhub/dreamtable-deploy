export const CATEGORIES = [
  "all",
  "rice",
  "grills",
  "pasta",
  "burgers",
  "sides",
  "drinks",
  "desserts",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  all: "All",
  rice: "Rice",
  grills: "Grills",
  pasta: "Pasta",
  burgers: "Burgers",
  sides: "Sides",
  drinks: "Drinks",
  desserts: "Desserts",
};

export type SpiceLevel = 0 | 1 | 2 | 3;
export type SpiceChoice = "mild" | "medium" | "hot" | "extra-hot";

export const SPICE_CHOICES: { id: SpiceChoice; label: string; level: SpiceLevel }[] = [
  { id: "mild", label: "Mild", level: 1 },
  { id: "medium", label: "Medium", level: 2 },
  { id: "hot", label: "Hot", level: 3 },
  { id: "extra-hot", label: "Extra Hot", level: 3 },
];

export type Protein = "chicken" | "beef" | "fish" | "prawns";
export type ExtraId = "plantain" | "coleslaw" | "fries" | "extra-protein" | "extra-sauce";

export const PROTEINS: { id: Protein; label: string; price: number }[] = [
  { id: "chicken", label: "Chicken", price: 0 },
  { id: "beef", label: "Beef", price: 500 },
  { id: "fish", label: "Fish", price: 1000 },
  { id: "prawns", label: "Prawns", price: 2000 },
];

export const EXTRAS: { id: ExtraId; label: string; price: number }[] = [
  { id: "plantain", label: "Plantain", price: 1500 },
  { id: "coleslaw", label: "Coleslaw", price: 1000 },
  { id: "fries", label: "Fries", price: 1500 },
  { id: "extra-protein", label: "Extra protein", price: 3000 },
  { id: "extra-sauce", label: "Extra sauce", price: 500 },
];

export type PlateBase = "jollof" | "fried-rice" | "white-rice" | "fries" | "pasta";
export type PlateSauce = "pepper" | "signature" | "garlic" | "none";

export const PLATE_BASES: { id: PlateBase; label: string; price: number }[] = [
  { id: "jollof", label: "Jollof", price: 3500 },
  { id: "fried-rice", label: "Fried Rice", price: 3500 },
  { id: "white-rice", label: "White Rice", price: 2500 },
  { id: "fries", label: "Fries", price: 2500 },
  { id: "pasta", label: "Pasta", price: 4000 },
];

export const PLATE_SAUCES: { id: PlateSauce; label: string }[] = [
  { id: "pepper", label: "Pepper Sauce" },
  { id: "signature", label: "DreamTable Signature Sauce" },
  { id: "garlic", label: "Garlic Sauce" },
  { id: "none", label: "No Sauce" },
];

export const PLATE_PROTEINS: { id: Protein; label: string; price: number }[] = [
  { id: "chicken", label: "Chicken", price: 3000 },
  { id: "beef", label: "Beef", price: 3500 },
  { id: "fish", label: "Fish", price: 4000 },
  { id: "prawns", label: "Prawns", price: 5000 },
];

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Exclude<Category, "all">;
  image: string;
  spice: SpiceLevel;
  popular: boolean;
  vegetarian: boolean;
  available: boolean;
  ingredients: string[];
  signature?: number;
  customizable: boolean;
}

export interface CartLine {
  lineId: string;
  menuItemId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  protein?: Protein;
  extras: ExtraId[];
  spice?: SpiceChoice;
  notes?: string;
  customLabel?: string;
}

export type Fulfillment = "delivery" | "pickup";
export type PaymentMethod = "card" | "transfer" | "cash";

export const ORDER_STATUSES = [
  "new",
  "confirmed",
  "preparing",
  "ready",
  "out-for-delivery",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: "New",
  confirmed: "Confirmed",
  preparing: "Kitchen preparing",
  ready: "Ready",
  "out-for-delivery": "On the way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export interface OrderCustomer {
  name: string;
  phone: string;
  address: string;
  apartment: string;
  instructions: string;
}

export interface Order {
  id: string;
  items: CartLine[];
  status: OrderStatus;
  fulfillment: Fulfillment;
  customer: OrderCustomer;
  payment: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  promoCode?: string;
  createdAt: string;
  etaMinutes: number;
  rider?: { name: string; vehicle: string; phone: string };
  pointsEarned: number;
}

export type Occasion =
  | "dinner"
  | "birthday"
  | "date-night"
  | "business"
  | "celebration";

export const OCCASIONS: { id: Occasion; label: string }[] = [
  { id: "dinner", label: "Dinner" },
  { id: "birthday", label: "Birthday" },
  { id: "date-night", label: "Date Night" },
  { id: "business", label: "Business Dinner" },
  { id: "celebration", label: "Celebration" },
];

export type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  occasion: Occasion;
  request: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface Address {
  id: string;
  label: string;
  line: string;
  apartment: string;
}

export interface Profile {
  name: string;
  phone: string;
  email: string;
}

export interface LoyaltyEvent {
  id: string;
  label: string;
  points: number;
  at: string;
}

export interface Reward {
  id: string;
  label: string;
  points: number;
  type: "drink" | "side" | "discount" | "meal";
}

export const REWARDS: Reward[] = [
  { id: "drink", label: "Free drink", points: 500, type: "drink" },
  { id: "side", label: "Free side", points: 1500, type: "side" },
  { id: "discount", label: "₦2,000 discount", points: 2500, type: "discount" },
  { id: "meal", label: "Free main meal", points: 5000, type: "meal" },
];

export interface Promo {
  code: string;
  label: string;
  type: "percent" | "flat";
  value: number;
}

export const PROMOS: Promo[] = [
  { code: "DREAM10", label: "10% off your order", type: "percent", value: 10 },
  { code: "WELCOME", label: "₦1,000 off", type: "flat", value: 1000 },
];

export const DELIVERY_FEE = 1500;
export const FREE_DELIVERY_OVER = 25000;
export const KITCHEN_CLOSES = "10:30 PM";
export const RESTAURANT_ADDRESS = "14 Adeola Odeku Street, Victoria Island, Lagos";
export const RESTAURANT_PHONE = "+234 201 330 1840";
