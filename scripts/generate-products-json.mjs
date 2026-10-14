// scripts/generate-products-json.mjs
// Run: node scripts/generate-products-json.mjs
// Purpose: Convert mockProducts to products.json for migration

import { mockProducts } from '../src/data/products.ts';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Transform products — map to snake_case keys for Supabase
const supabaseProducts = mockProducts.map((p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  subCategory: p.subCategory,
  brand: p.brand,
  team: p.team,
  type: p.type,
  price: p.price,
  image_url: p.image_url,
  images: p.images,
  rating: p.rating,
  reviews_count: p.reviews_count,
  description: p.description,
  sizes: p.sizes,
  reviews: p.reviews,
  stock: p.stock,
  colors: p.colors,
}));

const outputPath = path.join(__dirname, 'products.json');
fs.writeFileSync(outputPath, JSON.stringify(supabaseProducts, null, 2), 'utf8');

console.log(`✅ Generated ${supabaseProducts.length} products`);
console.log(`📁 File: ${outputPath}`);
console.log(`📦 Size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);