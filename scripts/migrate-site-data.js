// scripts/migrate-site-data.js
// Run: node scripts/migrate-site-data.js

const dns = require('dns');
if (dns.setDefaultResultOrder) dns.setDefaultResultOrder('ipv4first');

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

async function main() {
  console.log('🚀 Starting site data migration...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Missing credentials');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // ============ DATA DEFINITIONS ============
  // (Copied from src/context/SiteDataContext.tsx defaults)

  const heroSlides = [
    {
      id: 1, badge: "New Season 24/25", title: "Play", highlight: "Your Way",
      player: "Kylian Mbappé", quote: "Speed. Precision. Greatness.",
      description: "Top jerseys & football shoes for every player. Premium quality gear delivered to your doorstep.",
      image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1600&auto=format&fit=crop",
      cta: "/shop", sort_order: 0,
    },
    {
      id: 2, badge: "CR7 Collection", title: "Dominate", highlight: "The Game",
      player: "Cristiano Ronaldo", quote: "Talent without working hard is nothing.",
      description: "Elite football boots built for champions. Feel the power in every step.",
      image: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?q=80&w=1600&auto=format&fit=crop",
      cta: "/shoes", sort_order: 1,
    },
    {
      id: 3, badge: "GOAT Edition", title: "Magic", highlight: "In Motion",
      player: "Lionel Messi", quote: "You have to fight to reach your dream.",
      description: "Jerseys and boots inspired by the greatest playmaker. Pure magic on the pitch.",
      image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1600&auto=format&fit=crop",
      cta: "/jerseys", sort_order: 2,
    },
    {
      id: 4, badge: "Striker Elite", title: "Lead", highlight: "The Attack",
      player: "Harry Kane", quote: "Hard work beats talent.",
      description: "Precision boots and jerseys for the modern striker. Score more, win more.",
      image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1600&auto=format&fit=crop",
      cta: "/shop", sort_order: 3,
    },
  ];

  const getDefaultEndDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    d.setHours(23, 59, 59, 0);
    return d.toISOString();
  };

  const offers = [
    {
      id: 1, badge: "Flash Sale", title: "End of Season", highlight: "Mega Sale",
      discount_text: "50",
      description: "Limited time offer! Grab your favorite jerseys, boots, and gear at unbeatable prices. Use code GOAL10 for extra 10% off.",
      coupon_code: "GOAL10",
      image: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?q=80&w=1600&auto=format&fit=crop",
      cta: "/shop", end_date: getDefaultEndDate(), is_active: true,
    },
  ];

  const features = [
    { id: 1, title: "Fast Delivery", description: "Worldwide shipping", icon: "Truck", sort_order: 0 },
    { id: 2, title: "Secure Payment", description: "100% protected", icon: "ShieldCheck", sort_order: 1 },
    { id: 3, title: "Premium Quality", description: "Original products", icon: "Award", sort_order: 2 },
    { id: 4, title: "24/7 Support", description: "Always here to help", icon: "Headphones", sort_order: 3 },
  ];

  const categories = [
    { id: 1, name: "Jerseys", slug: "jerseys", description: "Club & National Teams", image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=600&auto=format&fit=crop", sort_order: 0 },
    { id: 2, name: "Football Shoes", slug: "shoes", description: "Boots & Cleats", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop", sort_order: 1 },
  ];

  const brands = [
    { id: 1, name: "Nike", slug: "nike", tagline: "Just Do It", sort_order: 0 },
    { id: 2, name: "Adidas", slug: "adidas", tagline: "Impossible is Nothing", sort_order: 1 },
    { id: 3, name: "Puma", slug: "puma", tagline: "Forever Faster", sort_order: 2 },
    { id: 4, name: "Reebok", slug: "reebok", tagline: "Sport the Unexpected", sort_order: 3 },
    { id: 5, name: "New Balance", slug: "new-balance", tagline: "Fearlessly Independent", sort_order: 4 },
    { id: 6, name: "Under Armour", slug: "under-armour", tagline: "The Only Way is Through", sort_order: 5 },
    { id: 7, name: "Mizuno", slug: "mizuno", tagline: "Never Settle", sort_order: 6 },
    { id: 8, name: "Asics", slug: "asics", tagline: "Sound Mind Sound Body", sort_order: 7 },
    { id: 9, name: "Umbro", slug: "umbro", tagline: "The Heart of the Game", sort_order: 8 },
    { id: 10, name: "Diadora", slug: "diadora", tagline: "Italian Sportswear", sort_order: 9 },
  ];

  const teams = [
    { id: 1, name: "Real Madrid", logo: "https://upload.wikimedia.org/wikipedia/fr/c/c7/Logo_Real_Madrid.svg", bg_color: "from-blue-50 to-white dark:from-blue-900/20 dark:to-brand-card", sort_order: 0 },
    { id: 2, name: "Barcelona", logo: "https://upload.wikimedia.org/wikipedia/sco/4/47/FC_Barcelona_%28crest%29.svg", bg_color: "from-red-50 to-blue-50 dark:from-red-900/20 dark:to-blue-900/20", sort_order: 1 },
    { id: 3, name: "Man United", logo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg", bg_color: "from-red-50 to-white dark:from-red-900/20 dark:to-brand-card", sort_order: 2 },
    { id: 4, name: "Liverpool", logo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg", bg_color: "from-red-50 to-white dark:from-red-900/20 dark:to-brand-card", sort_order: 3 },
  ];

  const testimonials = [
    { id: 1, name: "James Anderson", role: "Football Player", avatar: "JA", text: "The jersey quality is absolutely premium. Fits perfectly and the delivery was super fast. Highly recommend GoalWear!", rating: 5, sort_order: 0 },
    { id: 2, name: "Sofia Martinez", role: "Football Coach", avatar: "SM", text: "Bought boots for my entire team. Great quality and the customer service was outstanding. Will definitely order again.", rating: 5, sort_order: 1 },
    { id: 3, name: "Rahim Khan", role: "Sports Enthusiast", avatar: "RK", text: "Amazing collection and fair prices. The checkout process was smooth and I received my order within 3 days!", rating: 5, sort_order: 2 },
  ];

  const instagramImages = [
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400&auto=format&fit=crop",
  ].map((url, idx) => ({ image_url: url, sort_order: idx }));

  const coupons = [
    { id: 1, code: "GOAL10", type: "percent", value: 10, description: "10% off your order", is_active: true },
    { id: 2, code: "WELCOME20", type: "percent", value: 20, description: "20% off for new customers", is_active: true },
    { id: 3, code: "FLAT15", type: "fixed", value: 15, description: "$15 off your order", is_active: true },
    { id: 4, code: "FREESHIP", type: "shipping", value: 0, description: "Free shipping", is_active: true },
  ];

  const siteConfig = {
    name: "GoalWear",
    tagline: "Premium Football Gear",
    description: "Shop the latest football jerseys, boots, and gear. Free shipping worldwide.",
    logo: "",
    email: "support@goalwear.com",
    phone: "+880 1234-567890",
    address: "123 Stadium Road, Dhaka, Bangladesh",
    facebook: "https://facebook.com/goalwear",
    instagram: "https://instagram.com/goalwear",
    twitter: "https://twitter.com/goalwear",
    youtube: "https://youtube.com/@goalwear",
    whatsapp: "8801234567890",
  };

  // ============ UPLOAD FUNCTIONS ============
  async function upload(table, data, label) {
    if (!data || data.length === 0) {
      console.log(`⏭️  ${label}: no data`);
      return { ok: 0, fail: 0 };
    }

    const { error } = await supabase
      .from(table)
      .upsert(data, { onConflict: 'id' });

    if (error) {
      console.error(`❌ ${label} failed:`, error.message);
      return { ok: 0, fail: data.length };
    }

    console.log(`✅ ${label}: ${data.length} rows uploaded`);
    return { ok: data.length, fail: 0 };
  }

  async function uploadNoId(table, data, label) {
    if (!data || data.length === 0) {
      console.log(`⏭️  ${label}: no data`);
      return { ok: 0, fail: 0 };
    }

    // Delete existing and re-insert
    await supabase.from(table).delete().neq('id', 0);

    const { error } = await supabase.from(table).insert(data);

    if (error) {
      console.error(`❌ ${label} failed:`, error.message);
      return { ok: 0, fail: data.length };
    }

    console.log(`✅ ${label}: ${data.length} rows uploaded`);
    return { ok: data.length, fail: 0 };
  }

  // ============ RUN MIGRATION ============
  console.log('📤 Starting uploads...\n');
  let totalOk = 0;
  let totalFail = 0;

  const r1 = await upload('hero_slides', heroSlides, 'Hero Slides');
  totalOk += r1.ok; totalFail += r1.fail;
  await new Promise(r => setTimeout(r, 500));

  const r2 = await upload('offers', offers, 'Offers');
  totalOk += r2.ok; totalFail += r2.fail;
  await new Promise(r => setTimeout(r, 500));

  const r3 = await upload('features', features, 'Features');
  totalOk += r3.ok; totalFail += r3.fail;
  await new Promise(r => setTimeout(r, 500));

  const r4 = await upload('categories', categories, 'Categories');
  totalOk += r4.ok; totalFail += r4.fail;
  await new Promise(r => setTimeout(r, 500));

  const r5 = await upload('brands', brands, 'Brands');
  totalOk += r5.ok; totalFail += r5.fail;
  await new Promise(r => setTimeout(r, 500));

  const r6 = await upload('teams', teams, 'Teams');
  totalOk += r6.ok; totalFail += r6.fail;
  await new Promise(r => setTimeout(r, 500));

  const r7 = await upload('testimonials', testimonials, 'Testimonials');
  totalOk += r7.ok; totalFail += r7.fail;
  await new Promise(r => setTimeout(r, 500));

  const r8 = await uploadNoId('instagram_images', instagramImages, 'Instagram Images');
  totalOk += r8.ok; totalFail += r8.fail;
  await new Promise(r => setTimeout(r, 500));

  const r9 = await upload('coupons', coupons, 'Coupons');
  totalOk += r9.ok; totalFail += r9.fail;
  await new Promise(r => setTimeout(r, 500));

  // Site config — single row
  const { error: cfgErr } = await supabase
    .from('site_config')
    .upsert({ id: 1, config: siteConfig, updated_at: new Date().toISOString() });

  if (cfgErr) {
    console.error('❌ Site Config failed:', cfgErr.message);
    totalFail += 1;
  } else {
    console.log('✅ Site Config: uploaded');
    totalOk += 1;
  }

  console.log('\n=================================');
  console.log('📊 Site Data Migration Summary');
  console.log('=================================');
  console.log(`✅ Success: ${totalOk}`);
  console.log(`❌ Failed:  ${totalFail}`);
  console.log('=================================\n');

  if (totalFail === 0) {
    console.log('🎉 Site data migration completed!');
  } else {
    console.log('⚠️  Some items failed. Re-run is safe (upsert).');
  }
}

main().catch((err) => {
  console.error('💥 Crash:', err.message);
  process.exit(1);
});