// src/data/products.ts

// ============ Color Name → Hex Map ============
export const COLOR_NAME_MAP: Record<string, string> = {
  black: "#0A0A0A", white: "#FFFFFF", gray: "#6B7280", grey: "#6B7280", silver: "#C0C0C0",
  red: "#EF4444", crimson: "#DC2626", maroon: "#7F1D1D", orange: "#F97316", coral: "#FB7185",
  salmon: "#FA8072", peach: "#FFCBA4", brown: "#92400E", tan: "#D2B48C", gold: "#FFD700",
  yellow: "#EAB308", amber: "#F59E0B", cream: "#FFFDD0", beige: "#F5F5DC",
  green: "#22C55E", lime: "#84CC16", mint: "#98FF98", olive: "#808000", teal: "#14B8A6",
  turquoise: "#40E0D0", cyan: "#06B6D4", aqua: "#00FFFF",
  blue: "#3B82F6", navy: "#1E3A8A", skyblue: "#87CEEB", "sky blue": "#87CEEB",
  royalblue: "#4169E1", "royal blue": "#4169E1",
  purple: "#A855F7", violet: "#8B5CF6", indigo: "#4F46E5", magenta: "#EC4899",
  pink: "#EC4899", lavender: "#E6E6FA",
  home: "#EF4444", away: "#3B82F6", third: "#0A0A0A", alt: "#EAB308",
  khaki: "#C3B091", chocolate: "#7B3F00", charcoal: "#36454F", ivory: "#FFFFF0", pearl: "#F0EAD6",
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
  image_url?: string;
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
  subCategory: string;
  brand: string;
  team: string;
  type: string;
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

  season?: string;
  highlights?: string[];
  specifications?: Specification[];
  customFields?: CustomField[];
  deliveryTime?: string;

  kitType?: "Home" | "Away" | "Third" | "Goalkeeper";
  playerName?: string;
  playerNumber?: number;
  isPlayerEdition?: boolean;
  sleeveType?: "Short Sleeve" | "Long Sleeve" | "Sleeveless";
  collarType?: "Crew Neck" | "V-Neck" | "Polo" | "Henley";
  fitType?: "Regular" | "Slim" | "Oversized";
  sponsor?: string;

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

// ============ Helper Functions ============
export const getProductsByCategory = (products: Product[], category: string) =>
  products.filter((p) => p.category === category);

export const getProductsBySubCategory = (products: Product[], subCategory: string) =>
  products.filter((p) => p.subCategory === subCategory);

export const getProductsByBrand = (products: Product[], brand: string) =>
  products.filter((p) => p.brand === brand);

export const getAllBrands = (products: Product[]) =>
  Array.from(new Set(products.map((p) => p.brand))).sort();

export const getAllCountries = () => countries;
export const getAllClubs = () => clubs;