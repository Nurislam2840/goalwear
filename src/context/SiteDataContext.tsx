// src/context/SiteDataContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { Product, Review, ColorOption } from "@/data/products";

export type { Product, Review, ColorOption };

// ============ Types ============
export interface HeroSlide { id: number; badge: string; title: string; highlight: string; player: string; quote: string; description: string; image: string; cta: string; }
export interface Offer { id: number; badge: string; title: string; highlight: string; discountText: string; description: string; couponCode: string; image: string; cta: string; endDate: string; isActive: boolean; }
export interface Feature { id: number; title: string; desc: string; icon: string; }
export interface Category { id: number; name: string; slug: string; desc: string; image: string; }
export interface Brand { id: number; name: string; slug: string; tagline: string; logo?: string; }
export interface Team { id: number; name: string; logo: string; bgColor: string; }
export interface Testimonial { id: number; name: string; role: string; avatar: string; text: string; rating: number; }
export interface CouponData { id: number; code: string; type: "percent" | "fixed" | "shipping"; value: number; description: string; }
export interface SiteConfigData { name: string; tagline: string; description: string; logo: string; email: string; phone: string; address: string; facebook: string; instagram: string; twitter: string; youtube: string; whatsapp: string; newArrivalIds: number[]; }

interface SiteDataContextType {
  siteConfig: SiteConfigData;
  heroSlides: HeroSlide[];
  offers: Offer[];
  features: Feature[];
  categories: Category[];
  brands: Brand[];
  products: Product[];
  teams: Team[];
  testimonials: Testimonial[];
  instagramImages: string[];
  coupons: CouponData[];

  updateSiteConfig: (config: Partial<SiteConfigData>) => Promise<void>;
  updateHeroSlides: (slides: HeroSlide[]) => Promise<void>;
  updateOffers: (offers: Offer[]) => Promise<void>;
  updateFeatures: (features: Feature[]) => Promise<void>;
  updateCategories: (categories: Category[]) => Promise<void>;
  updateBrands: (brands: Brand[]) => Promise<void>;
  updateProducts: (products: Product[]) => Promise<void>;
  updateTeams: (teams: Team[]) => Promise<void>;
  updateTestimonials: (testimonials: Testimonial[]) => Promise<void>;
  updateInstagramImages: (images: string[]) => Promise<void>;
  updateCoupons: (coupons: CouponData[]) => Promise<void>;
  addProductReview: (productId: number, review: Review) => Promise<void>;
  reduceStock: (items: { id: number; quantity: number }[]) => Promise<void>;
  resetAll: () => Promise<void>;
  isHydrated: boolean;
}

// ============ Default Data ============
const defaultSiteConfig: SiteConfigData = {
  name: "GoalWear", tagline: "Premium Football Gear", description: "Shop the latest football jerseys, boots, and gear. Free shipping worldwide.",
  logo: "", email: "support@goalwear.com", phone: "+880 1234-567890", address: "123 Stadium Road, Dhaka, Bangladesh",
  facebook: "https://facebook.com/goalwear", instagram: "https://instagram.com/goalwear", twitter: "https://twitter.com/goalwear",
  youtube: "https://youtube.com/@goalwear", whatsapp: "8801234567890", newArrivalIds: [],
};

const defaultHeroSlides: HeroSlide[] = [
  { id: 1, badge: "New Season 24/25", title: "Play", highlight: "Your Way", player: "Kylian Mbappé", quote: "Speed. Precision. Greatness.", description: "Top jerseys & football shoes...", image: "", cta: "/shop" },
  { id: 2, badge: "CR7 Collection", title: "Dominate", highlight: "The Game", player: "Cristiano Ronaldo", quote: "Talent without working hard is nothing.", description: "Elite football boots...", image: "", cta: "/shoes" },
  { id: 3, badge: "GOAT Edition", title: "Magic", highlight: "In Motion", player: "Lionel Messi", quote: "You have to fight to reach your dream.", description: "Jerseys and boots...", image: "", cta: "/jerseys" },
  { id: 4, badge: "Striker Elite", title: "Lead", highlight: "The Attack", player: "Harry Kane", quote: "Hard work beats talent.", description: "Precision boots and jerseys...", image: "", cta: "/shop" },
];

const getDefaultEndDate = () => { const d = new Date(); d.setDate(d.getDate() + 7); d.setHours(23, 59, 59, 0); return d.toISOString(); };

const defaultOffers: Offer[] = [
  { id: 1, badge: "Flash Sale", title: "End of Season", highlight: "Mega Sale", discountText: "50", description: "Limited time offer! Grab your favorite...", couponCode: "GOAL10", image: "", cta: "/shop", endDate: getDefaultEndDate(), isActive: true },
];

const defaultFeatures: Feature[] = [
  { id: 1, title: "Fast Delivery", desc: "Worldwide shipping", icon: "Truck" },
  { id: 2, title: "Secure Payment", desc: "100% protected", icon: "ShieldCheck" },
  { id: 3, title: "Premium Quality", desc: "Original products", icon: "Award" },
  { id: 4, title: "24/7 Support", desc: "Always here to help", icon: "Headphones" },
];

const defaultCategories: Category[] = [
  { id: 1, name: "Jerseys", slug: "jerseys", desc: "Club & National Teams", image: "" },
  { id: 2, name: "Football Shoes", slug: "shoes", desc: "Boots & Cleats", image: "" },
  { id: 3, name: "Cricket Jersey", slug: "cricket-jersey", desc: "National & League Cricket Kits", image: "" },
];

const defaultBrands: Brand[] = [
  { id: 1, name: "Nike", slug: "nike", tagline: "Just Do It", logo: "" },
  { id: 2, name: "Adidas", slug: "adidas", tagline: "Impossible is Nothing", logo: "" },
  { id: 3, name: "Puma", slug: "puma", tagline: "Forever Faster", logo: "" },
  { id: 4, name: "Reebok", slug: "reebok", tagline: "Sport the Unexpected", logo: "" },
  { id: 5, name: "New Balance", slug: "new-balance", tagline: "Fearlessly Independent", logo: "" },
  { id: 6, name: "Under Armour", slug: "under-armour", tagline: "The Only Way is Through", logo: "" },
  { id: 7, name: "Mizuno", slug: "mizuno", tagline: "Never Settle", logo: "" },
  { id: 8, name: "Asics", slug: "asics", tagline: "Sound Mind Sound Body", logo: "" },
  { id: 9, name: "Umbro", slug: "umbro", tagline: "The Heart of the Game", logo: "" },
  { id: 10, name: "Diadora", slug: "diadora", tagline: "Italian Sportswear", logo: "" },
];

const defaultTeams: Team[] = [
  { id: 1, name: "Real Madrid", logo: "https://upload.wikimedia.org/wikipedia/fr/c/c7/Logo_Real_Madrid.svg", bgColor: "from-blue-50 to-white dark:from-blue-900/20 dark:to-brand-card" },
  { id: 2, name: "Barcelona", logo: "https://upload.wikimedia.org/wikipedia/sco/4/47/FC_Barcelona_%28crest%29.svg", bgColor: "from-red-50 to-blue-50 dark:from-red-900/20 dark:to-blue-900/20" },
  { id: 3, name: "Man United", logo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg", bgColor: "from-red-50 to-white dark:from-red-900/20 dark:to-brand-card" },
  { id: 4, name: "Liverpool", logo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg", bgColor: "from-red-50 to-white dark:from-red-900/20 dark:to-brand-card" },
];

const defaultTestimonials: Testimonial[] = [
  { id: 1, name: "James Anderson", role: "Football Player", avatar: "JA", text: "The jersey quality is absolutely premium...", rating: 5 },
  { id: 2, name: "Sofia Martinez", role: "Football Coach", avatar: "SM", text: "Bought boots for my entire team...", rating: 5 },
  { id: 3, name: "Rahim Khan", role: "Sports Enthusiast", avatar: "RK", text: "Amazing collection and fair prices...", rating: 5 },
];

const defaultInstagramImages: string[] = [];

const defaultCoupons: CouponData[] = [
  { id: 1, code: "GOAL10", type: "percent", value: 10, description: "10% off your order" },
  { id: 2, code: "WELCOME20", type: "percent", value: 20, description: "20% off for new customers" },
  { id: 3, code: "FLAT15", type: "fixed", value: 15, description: "$15 off your order" },
  { id: 4, code: "FREESHIP", type: "shipping", value: 0, description: "Free shipping" },
];

// ============ Type Converters ============
function normalizeProducts(products: any[]): Product[] {
  return products.map((p) => ({ ...p, colors: Array.isArray(p.colors) ? p.colors : [] }));
}

function dbToProduct(row: any): Product {
  return {
    id: row.id, name: row.name, category: row.category, subCategory: row.sub_category, brand: row.brand, team: row.team, type: row.type,
    price: Number(row.price), image_url: row.image_url, images: row.images || [], rating: Number(row.rating) || 0, reviews_count: row.reviews_count || 0,
    description: row.description, sizes: row.sizes || [], reviews: row.reviews || [], stock: row.stock || 0, colors: Array.isArray(row.colors) ? row.colors : [],
    season: row.season || "", highlights: row.highlights || [], specifications: row.specifications || [], customFields: row.custom_fields || [], deliveryTime: row.delivery_time || "",
    kitType: row.kit_type || undefined, playerName: row.player_name || "", playerNumber: row.player_number || undefined, isPlayerEdition: row.is_player_edition || false,
    sleeveType: row.sleeve_type || undefined, collarType: row.collar_type || undefined, fitType: row.fit_type || undefined, sponsor: row.sponsor || "",
    surface: row.surface || undefined, playStyle: row.play_style || undefined, bootHeight: row.boot_height || undefined, weightGrams: row.weight_grams || undefined,
    upperMaterial: row.upper_material || "", soleplate: row.soleplate || "", studType: row.stud_type || "", closureType: row.closure_type || undefined, collection: row.collection || "", releaseYear: row.release_year || undefined,
  };
}

function dbToHeroSlide(row: any): HeroSlide { return { id: row.id, badge: row.badge, title: row.title, highlight: row.highlight, player: row.player, quote: row.quote, description: row.description, image: row.image, cta: row.cta }; }
function dbToOffer(row: any): Offer { return { id: row.id, badge: row.badge, title: row.title, highlight: row.highlight, discountText: row.discount_text, description: row.description, couponCode: row.coupon_code, image: row.image, cta: row.cta, endDate: row.end_date, isActive: row.is_active }; }
function dbToFeature(row: any): Feature { return { id: row.id, title: row.title, desc: row.description, icon: row.icon }; }
function dbToCategory(row: any): Category { return { id: row.id, name: row.name, slug: row.slug, desc: row.description, image: row.image }; }
function dbToBrand(row: any): Brand { return { id: row.id, name: row.name, slug: row.slug, tagline: row.tagline, logo: row.logo || "" }; }
function dbToTeam(row: any): Team { return { id: row.id, name: row.name, logo: row.logo, bgColor: row.bg_color }; }
function dbToTestimonial(row: any): Testimonial { return { id: row.id, name: row.name, role: row.role, avatar: row.avatar, text: row.text, rating: row.rating }; }
function dbToCoupon(row: any): CouponData { return { id: row.id, code: row.code, type: row.type, value: Number(row.value), description: row.description }; }

// ============ Context ============
const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [siteConfig, setSiteConfig] = useState<SiteConfigData>(defaultSiteConfig);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(defaultHeroSlides);
  const [offers, setOffers] = useState<Offer[]>(defaultOffers);
  const [features, setFeatures] = useState<Feature[]>(defaultFeatures);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [brands, setBrands] = useState<Brand[]>(defaultBrands);
  const [products, setProducts] = useState<Product[]>([]);
  const [teams, setTeams] = useState<Team[]>(defaultTeams);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [instagramImages, setInstagramImages] = useState<string[]>(defaultInstagramImages);
  const [coupons, setCoupons] = useState<CouponData[]>(defaultCoupons);
  const [isHydrated, setIsHydrated] = useState(false);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    async function loadAllData() {
      try {
        const [
          productsRes, heroSlidesRes, offersRes, featuresRes, categoriesRes,
          brandsRes, teamsRes, testimonialsRes, instagramRes, couponsRes,
          siteConfigRes, reviewsRes,
        ] = await Promise.all([
          supabase.from("products").select("*").order("id"),
          supabase.from("hero_slides").select("*").order("sort_order"),
          supabase.from("offers").select("*").order("id"),
          supabase.from("features").select("*").order("sort_order"),
          supabase.from("categories").select("*").order("sort_order"),
          supabase.from("brands").select("*").order("sort_order"),
          supabase.from("teams").select("*").order("sort_order"),
          supabase.from("testimonials").select("*").order("sort_order"),
          supabase.from("instagram_images").select("*").order("sort_order"),
          supabase.from("coupons").select("*").order("id"),
          supabase.from("site_config").select("*").eq("id", 1).maybeSingle(),
          supabase.from("reviews").select("*").eq("approved", true).order("created_at", { ascending: false }), // 👈 শুধু approved
        ]);

        const allReviews = reviewsRes.data || [];
        if (productsRes.data && productsRes.data.length > 0) {
          const formattedProducts = productsRes.data.map((row) => {
            const product = dbToProduct(row);
            const productReviews = allReviews
              .filter((r: any) => r.product_id === product.id)
              .map((r: any) => ({
                name: r.user_name, rating: r.rating, comment: r.comment,
                date: new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                image_url: r.image_url || "",
              }));
            const legacyReviews = product.reviews || [];
            const combinedReviews = [...productReviews, ...legacyReviews];
            let finalRating = product.rating;
            let finalCount = product.reviews_count;
            if (combinedReviews.length > 0) {
              finalCount = combinedReviews.length;
              finalRating = Number((combinedReviews.reduce((sum, r) => sum + r.rating, 0) / finalCount).toFixed(1));
            }
            return { ...product, reviews: combinedReviews, reviews_count: finalCount, rating: finalRating };
          });
          setProducts(normalizeProducts(formattedProducts));
        } else {
          setProducts([]);
        }

        if (heroSlidesRes.data && heroSlidesRes.data.length > 0) setHeroSlides(heroSlidesRes.data.map(dbToHeroSlide));
        if (offersRes.data && offersRes.data.length > 0) setOffers(offersRes.data.map(dbToOffer));
        if (featuresRes.data && featuresRes.data.length > 0) setFeatures(featuresRes.data.map(dbToFeature));
        if (categoriesRes.data && categoriesRes.data.length > 0) setCategories(categoriesRes.data.map(dbToCategory));
        if (brandsRes.data && brandsRes.data.length > 0) setBrands(brandsRes.data.map(dbToBrand));
        if (teamsRes.data && teamsRes.data.length > 0) setTeams(teamsRes.data.map(dbToTeam));
        if (testimonialsRes.data && testimonialsRes.data.length > 0) setTestimonials(testimonialsRes.data.map(dbToTestimonial));
        if (instagramRes.data && instagramRes.data.length > 0) setInstagramImages(instagramRes.data.map((r: any) => r.image_url));
        if (couponsRes.data && couponsRes.data.length > 0) setCoupons(couponsRes.data.map(dbToCoupon));
        if (siteConfigRes.data && siteConfigRes.data.config) {
          setSiteConfig({
            ...defaultSiteConfig,
            ...siteConfigRes.data.config,
            newArrivalIds: Array.isArray(siteConfigRes.data.config.newArrivalIds) ? siteConfigRes.data.config.newArrivalIds : [],
          });
        }
      } catch (err) {
        console.error("❌ Failed to load data:", err);
        setProducts([]);
      } finally {
        setIsHydrated(true);
      }
    }
    loadAllData();
  }, []);

  async function saveToServer(table: string, data: any) {
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ table, data }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      return true;
    } catch (err: any) {
      console.error(`[saveToServer] Exception for "${table}":`, err.message);
      throw err;
    }
  }

  const updateSiteConfig = async (config: Partial<SiteConfigData>) => { const newConfig = { ...siteConfig, ...config }; setSiteConfig(newConfig); await saveToServer("site_config", { id: 1, config: newConfig }); };
  const updateHeroSlides = async (slides: HeroSlide[]) => { setHeroSlides(slides); await saveToServer("hero_slides", slides.map((s, i) => ({ id: s.id, badge: s.badge, title: s.title, highlight: s.highlight, player: s.player, quote: s.quote, description: s.description, image: s.image, cta: s.cta, sort_order: i }))); };
  const updateOffers = async (offers: Offer[]) => { setOffers(offers); await saveToServer("offers", offers.map((o) => ({ id: o.id, badge: o.badge, title: o.title, highlight: o.highlight, discount_text: o.discountText, description: o.description, coupon_code: o.couponCode, image: o.image, cta: o.cta, end_date: o.endDate, is_active: o.isActive }))); };
  const updateFeatures = async (features: Feature[]) => { setFeatures(features); await saveToServer("features", features.map((f, i) => ({ id: f.id, title: f.title, description: f.desc, icon: f.icon, sort_order: i }))); };
  const updateCategories = async (categories: Category[]) => { setCategories(categories); await saveToServer("categories", categories.map((c, i) => ({ id: c.id, name: c.name, slug: c.slug, description: c.desc, image: c.image, sort_order: i }))); };
  const updateBrands = async (brands: Brand[]) => { setBrands(brands); await saveToServer("brands", brands.map((b, i) => ({ id: b.id, name: b.name, slug: b.slug, tagline: b.tagline, logo: b.logo || null, sort_order: i }))); };
  const updateProducts = async (products: Product[]) => {
    setProducts(products);
    await saveToServer("products", products.map((p) => ({
      id: p.id, name: p.name, category: p.category, sub_category: p.subCategory, brand: p.brand, team: p.team, type: p.type, price: p.price,
      image_url: p.image_url, images: p.images || [], rating: p.rating || 0, reviews_count: p.reviews_count || 0, description: p.description,
      sizes: p.sizes || [], reviews: p.reviews || [], stock: p.stock || 0, colors: p.colors || [], season: p.season || null, highlights: p.highlights || [],
      specifications: p.specifications || [], custom_fields: p.customFields || [], delivery_time: p.deliveryTime || null, kit_type: p.kitType || null,
      player_name: p.playerName || null, player_number: p.playerNumber || null, is_player_edition: p.isPlayerEdition || false, sleeve_type: p.sleeveType || null,
      collar_type: p.collarType || null, fit_type: p.fitType || null, sponsor: p.sponsor || null, surface: p.surface || null, play_style: p.playStyle || null,
      boot_height: p.bootHeight || null, weight_grams: p.weightGrams || null, upper_material: p.upperMaterial || null, soleplate: p.soleplate || null,
      stud_type: p.studType || null, closure_type: p.closureType || null, collection: p.collection || null, release_year: p.releaseYear || null,
    })));
  };
  const updateTeams = async (teams: Team[]) => { setTeams(teams); await saveToServer("teams", teams.map((t, i) => ({ id: t.id, name: t.name, logo: t.logo, bg_color: t.bgColor, sort_order: i }))); };
  const updateTestimonials = async (testimonials: Testimonial[]) => { setTestimonials(testimonials); await saveToServer("testimonials", testimonials.map((t, i) => ({ id: t.id, name: t.name, role: t.role, avatar: t.avatar, text: t.text, rating: t.rating, sort_order: i }))); };
  const updateInstagramImages = async (images: string[]) => { setInstagramImages(images); await saveToServer("instagram_images", images.map((url, i) => ({ image_url: url, sort_order: i }))); };
  const updateCoupons = async (coupons: CouponData[]) => { setCoupons(coupons); await saveToServer("coupons", coupons.map((c) => ({ id: c.id, code: c.code, type: c.type, value: c.value, description: c.description, is_active: true }))); };

  // 👇 নতুন রিভিউ সাবমিট (API এর মাধ্যমে)
  const addProductReview = async (productId: number, review: Review) => {
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          user_name: review.name,
          rating: review.rating,
          comment: review.comment,
          image_url: review.image_url,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit review");
      }
    } catch (err: any) {
      console.error("Failed to add review:", err);
      throw err;
    }
  };

  const reduceStock = async (items: { id: number; quantity: number }[]) => {
    try {
      for (const item of items) {
        await supabase.rpc("decrement_stock", { p_id: item.id, p_qty: item.quantity });
      }
      setProducts((prev) =>
        prev.map((p) => {
          const orderedItem = items.find((i) => i.id === p.id);
          if (orderedItem) return { ...p, stock: Math.max(0, (p.stock || 0) - orderedItem.quantity) };
          return p;
        })
      );
    } catch (err) {
      console.error("Failed to reduce stock:", err);
    }
  };

  const resetAll = async () => {
    setSiteConfig(defaultSiteConfig); setHeroSlides(defaultHeroSlides); setOffers(defaultOffers);
    setFeatures(defaultFeatures); setCategories(defaultCategories); setBrands(defaultBrands);
    setProducts([]); setTeams(defaultTeams); setTestimonials(defaultTestimonials);
    setInstagramImages(defaultInstagramImages); setCoupons(defaultCoupons);
  };

  return (
    <SiteDataContext.Provider
      value={{
        siteConfig, heroSlides, offers, features, categories, brands, products, teams, testimonials, instagramImages, coupons,
        updateSiteConfig, updateHeroSlides, updateOffers, updateFeatures, updateCategories, updateBrands, updateProducts, updateTeams,
        updateTestimonials, updateInstagramImages, updateCoupons, addProductReview, reduceStock, resetAll, isHydrated,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const context = useContext(SiteDataContext);
  if (!context) throw new Error("useSiteData must be used within SiteDataProvider");
  return context;
}