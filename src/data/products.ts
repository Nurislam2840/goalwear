// src/data/products.ts

// ============ Color Name → Hex Map ============
export const COLOR_NAME_MAP: Record<string, string> = {
  // Basic
  black: "#0A0A0A",
  white: "#FFFFFF",
  gray: "#6B7280",
  grey: "#6B7280",
  silver: "#C0C0C0",
  // Warm
  red: "#EF4444",
  crimson: "#DC2626",
  maroon: "#7F1D1D",
  orange: "#F97316",
  coral: "#FB7185",
  salmon: "#FA8072",
  peach: "#FFCBA4",
  brown: "#92400E",
  tan: "#D2B48C",
  gold: "#FFD700",
  yellow: "#EAB308",
  amber: "#F59E0B",
  cream: "#FFFDD0",
  beige: "#F5F5DC",
  // Cool
  green: "#22C55E",
  lime: "#84CC16",
  mint: "#98FF98",
  olive: "#808000",
  teal: "#14B8A6",
  turquoise: "#40E0D0",
  cyan: "#06B6D4",
  aqua: "#00FFFF",
  // Blue
  blue: "#3B82F6",
  navy: "#1E3A8A",
  skyblue: "#87CEEB",
  "sky blue": "#87CEEB",
  royalblue: "#4169E1",
  "royal blue": "#4169E1",
  // Purple
  purple: "#A855F7",
  violet: "#8B5CF6",
  indigo: "#4F46E5",
  magenta: "#EC4899",
  pink: "#EC4899",
  lavender: "#E6E6FA",
  // Sport specific
  home: "#EF4444",
  away: "#3B82F6",
  third: "#0A0A0A",
  alt: "#EAB308",
  // Misc
  khaki: "#C3B091",
  chocolate: "#7B3F00",
  charcoal: "#36454F",
  ivory: "#FFFFF0",
  pearl: "#F0EAD6",
};

export function getHexFromColorName(name: string): string | null {
  const key = name.trim().toLowerCase().replace(/\s+/g, " ");
  return COLOR_NAME_MAP[key] || null;
}

// ============ Types ============
export interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ColorOption {
  name: string;
  hex: string;
}

export interface Specification {
  label: string;
  value: string;
}

export interface CustomField {
  label: string;
  value: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  subCategory: "Country" | "Club" | "Boot";
  brand: string;
  team: string;
  type: "Home" | "Away" | "Boot";
  price: number;
  image_url: string;
  images: string[];
  rating: number;
  reviews_count: number;
  description: string;
  sizes: string[];
  reviews: Review[];
  stock: number;
  colors: ColorOption[];

  // ============ Common Advanced Fields ============
  season?: string;
  highlights?: string[];
  specifications?: Specification[];
  customFields?: CustomField[];

  // ============ Jersey-specific Fields ============
  kitType?: "Home" | "Away" | "Third" | "Goalkeeper";
  playerName?: string;
  playerNumber?: number;
  isPlayerEdition?: boolean;
  sleeveType?: "Short Sleeve" | "Long Sleeve" | "Sleeveless";
  collarType?: "Crew Neck" | "V-Neck" | "Polo" | "Henley";
  fitType?: "Regular" | "Slim" | "Oversized";
  sponsor?: string;

  // ============ Boot-specific Fields ============
  surface?: "FG" | "SG" | "AG" | "IC" | "TF" | "MG";
  playStyle?: "Speed" | "Control" | "Power" | "Balance";
  bootHeight?: "Low" | "Mid" | "High";
  weightGrams?: number;
  upperMaterial?: string;
  soleplate?: string;
  studType?: string;
  closureType?: "Lace-up" | "Laceless" | "Straps" | "Mixed";
  collection?: string;
  releaseYear?: number;
}

// ============ Default Colors ============
export const DEFAULT_COLORS: ColorOption[] = [
  { name: "Black", hex: "#0A0A0A" },
  { name: "Pink", hex: "#EC4899" },
  { name: "Blue", hex: "#3B82F6" },
  { name: "Yellow", hex: "#EAB308" },
];

// ============ Color Presets ============
export const COLOR_PRESETS: { name: string; colors: ColorOption[] }[] = [
  {
    name: "Classic",
    colors: [
      { name: "Black", hex: "#0A0A0A" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Gray", hex: "#6B7280" },
    ],
  },
  {
    name: "Sports",
    colors: [
      { name: "Pink", hex: "#EC4899" },
      { name: "Blue", hex: "#3B82F6" },
      { name: "Yellow", hex: "#EAB308" },
      { name: "Green", hex: "#22C55E" },
    ],
  },
  {
    name: "Team Jersey",
    colors: [
      { name: "Red", hex: "#EF4444" },
      { name: "Blue", hex: "#3B82F6" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#0A0A0A" },
    ],
  },
  {
    name: "Football Boots",
    colors: [
      { name: "Black", hex: "#0A0A0A" },
      { name: "Red", hex: "#EF4444" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Yellow", hex: "#EAB308" },
    ],
  },
];

// ============ Country List ============
export const countries = [
  "Argentina", "Brazil", "France", "England", "Spain", "Germany", "Portugal",
  "Netherlands", "Belgium", "Italy", "Croatia", "Uruguay", "Colombia", "Mexico",
  "USA", "Canada", "Japan", "South Korea", "Australia", "Morocco", "Senegal",
  "Nigeria", "Ghana", "Egypt", "Cameroon", "Ivory Coast", "Algeria", "Tunisia",
  "Saudi Arabia", "Iran", "Qatar", "UAE", "Uzbekistan", "China", "India",
  "Thailand", "Vietnam", "Indonesia", "Ecuador", "Chile", "Peru", "Paraguay",
  "Costa Rica", "Panama", "Jamaica", "Honduras", "New Zealand", "Switzerland",
];

// ============ Club List ============
export const clubs = [
  "Real Madrid", "Barcelona", "Atletico Madrid", "Sevilla", "Real Sociedad",
  "Real Betis", "Villarreal", "Valencia", "Athletic Bilbao", "Celta Vigo",
  "Manchester United", "Manchester City", "Liverpool", "Arsenal", "Chelsea",
  "Tottenham", "Newcastle", "Aston Villa", "West Ham", "Brighton",
  "Bayern Munich", "Borussia Dortmund", "RB Leipzig", "Bayer Leverkusen",
  "Eintracht Frankfurt", "Borussia Monchengladbach", "Wolfsburg", "Freiburg",
  "Union Berlin", "Stuttgart",
  "PSG", "Marseille", "Lyon", "Monaco", "Lille", "Nice",
  "Juventus", "Inter Milan", "AC Milan", "Napoli", "Roma", "Lazio",
  "Atalanta", "Fiorentina",
  "Ajax", "PSV", "Feyenoord",
  "Porto", "Benfica", "Sporting CP",
];

// ============ Boots List ============
export const boots = [
  { name: "Nike Mercurial Superfly 10", brand: "Nike", price: 279.99 },
  { name: "Nike Phantom GX 2 Elite", brand: "Nike", price: 259.99 },
  { name: "Nike Tiempo Legend 10 Elite", brand: "Nike", price: 239.99 },
  { name: "Nike Zoom Vapor 16 Elite", brand: "Nike", price: 269.99 },
  { name: "Nike Phantom Luna 2", brand: "Nike", price: 249.99 },
  { name: "Adidas Predator Elite FG", brand: "Adidas", price: 279.99 },
  { name: "Adidas F50 Elite FG", brand: "Adidas", price: 289.99 },
  { name: "Adidas Copa Pure 2 Elite", brand: "Adidas", price: 229.99 },
  { name: "Adidas X Crazyfast Elite", brand: "Adidas", price: 259.99 },
  { name: "Adidas Predator League", brand: "Adidas", price: 189.99 },
  { name: "Puma Future 7 Ultimate", brand: "Puma", price: 249.99 },
  { name: "Puma Ultra 5 Ultimate", brand: "Puma", price: 239.99 },
  { name: "Puma King Ultimate", brand: "Puma", price: 219.99 },
  { name: "Puma Future Match", brand: "Puma", price: 179.99 },
  { name: "Mizuno Morelia Neo IV Beta", brand: "Mizuno", price: 269.99 },
  { name: "Mizuno Alpha Elite", brand: "Mizuno", price: 229.99 },
  { name: "New Balance Furon V7 Pro", brand: "New Balance", price: 199.99 },
  { name: "New Balance Tekela V4 Magia", brand: "New Balance", price: 189.99 },
  { name: "Under Armour Magnetico Pro 4", brand: "Under Armour", price: 209.99 },
  { name: "Under Armour Shadow Elite 3", brand: "Under Armour", price: 179.99 },
  { name: "Umbro Velocita Elixir Pro", brand: "Umbro", price: 169.99 },
  { name: "Umbro Medusae III Pro", brand: "Umbro", price: 149.99 },
  { name: "Diadora Brasil Italy OG", brand: "Diadora", price: 219.99 },
  { name: "Asics DS Light X-Fly 5", brand: "Asics", price: 199.99 },
  { name: "Kelme Precision Elite", brand: "Kelme", price: 149.99 },
  { name: "Lotto Solista 100 IV", brand: "Lotto", price: 169.99 },
  { name: "Joma Aguila Cup", brand: "Joma", price: 139.99 },
  { name: "Concave Halo+ v2", brand: "Concave", price: 179.99 },
  { name: "Hummel Concept Pro", brand: "Hummel", price: 159.99 },
  { name: "Penalty Factor Pro", brand: "Penalty", price: 129.99 },
];

// ============ Image Sets ============
export const jerseyImages = [
  "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?q=80&w=600&auto=format&fit=crop",
];

export const bootImages = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=600&auto=format&fit=crop",
];

// ============ Default Colors Per Category ============
export function getDefaultColorsForProduct(
  category: string,
  subCategory: string
): ColorOption[] {
  if (category === "Football Shoes") {
    return [
      { name: "Black", hex: "#0A0A0A" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Red", hex: "#EF4444" },
      { name: "Blue", hex: "#3B82F6" },
    ];
  }
  if (category === "Cricket Jersey") {
    return [
      { name: "White", hex: "#FFFFFF" },
      { name: "Blue", hex: "#3B82F6" },
      { name: "Green", hex: "#22C55E" },
      { name: "Yellow", hex: "#EAB308" },
    ];
  }
  return [
    { name: "Home", hex: "#EF4444" },
    { name: "Away", hex: "#3B82F6" },
    { name: "Third", hex: "#0A0A0A" },
    { name: "Alt", hex: "#EAB308" },
  ];
}

// ================================================================
// MOCK PRODUCTS — DISABLED
// ================================================================
// Demo products are no longer generated.
// Supabase is now the single source of truth for products.
//
// To add products:
//   1. Login to admin panel: /admin/login
//   2. Go to /admin/products
//   3. Click "Add New Product"
//
// The `mockProducts` export is kept as an empty array for backward
// compatibility with any code that still imports it. It will be
// removed in a future version.
// ================================================================

export const mockProducts: Product[] = [];

// ============ Helper Functions ============
export const getProductsByCategory = (products: Product[], category: string) =>
  products.filter((p) => p.category === category);

export const getProductsBySubCategory = (
  products: Product[],
  subCategory: string
) => products.filter((p) => p.subCategory === subCategory);

export const getProductsByBrand = (products: Product[], brand: string) =>
  products.filter((p) => p.brand === brand);

export const getAllBrands = (products: Product[]) =>
  Array.from(new Set(products.map((p) => p.brand))).sort();

export const getAllCountries = () => countries;
export const getAllClubs = () => clubs;