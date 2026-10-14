// scripts/migrate-products.js
// Run: node scripts/migrate-products.js

// Force IPv4 for DNS (helps with some mobile networks)
const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

async function main() {
  console.log('🚀 Starting product migration...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Missing credentials in .env.local');
    process.exit(1);
  }

  console.log('✅ Credentials loaded');
  console.log('   URL:', supabaseUrl);
  console.log('   Key length:', serviceKey.length);
  console.log('');

  // Standard Supabase client — no custom fetch
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const jsonPath = path.join(__dirname, 'products.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ products.json not found!');
    process.exit(1);
  }

  const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log(`📦 Loaded ${products.length} products\n`);

  // Check existing
  try {
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    console.log(`📊 Existing in Supabase: ${count || 0}\n`);
  } catch (err) {
    console.log('⚠️  Could not check existing (continuing)\n');
  }

  const supabaseProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    sub_category: p.subCategory || null,
    brand: p.brand || null,
    team: p.team || null,
    type: p.type || null,
    price: p.price,
    image_url: p.image_url || null,
    images: p.images || [],
    rating: p.rating || 0,
    reviews_count: p.reviews_count || 0,
    description: p.description || null,
    sizes: p.sizes || [],
    reviews: p.reviews || [],
    stock: p.stock || 0,
    colors: p.colors || [],
  }));

  // Smaller batches + retry logic
  const BATCH_SIZE = 10;
  const MAX_RETRIES = 3;
  const totalBatches = Math.ceil(supabaseProducts.length / BATCH_SIZE);
  let successCount = 0;
  let errorCount = 0;

  console.log(`📤 Uploading ${totalBatches} batches of ${BATCH_SIZE} (with retry)...\n`);

  for (let i = 0; i < supabaseProducts.length; i += BATCH_SIZE) {
    const batch = supabaseProducts.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;

    let attempt = 0;
    let batchSuccess = false;

    while (attempt < MAX_RETRIES && !batchSuccess) {
      attempt++;

      try {
        const { error } = await supabase
          .from('products')
          .upsert(batch, { onConflict: 'id' });

        if (error) {
          console.log(`⚠️  Batch ${batchNum} attempt ${attempt}: ${error.message}`);
          if (attempt < MAX_RETRIES) {
            await new Promise((r) => setTimeout(r, 1000 * attempt));
          }
        } else {
          batchSuccess = true;
          successCount += batch.length;
          console.log(
            `✅ Batch ${batchNum}/${totalBatches} — ${batch.length} products (IDs ${batch[0].id}-${batch[batch.length - 1].id})`
          );
        }
      } catch (err) {
        console.log(`⚠️  Batch ${batchNum} attempt ${attempt} crashed: ${err.message}`);
        if (attempt < MAX_RETRIES) {
          await new Promise((r) => setTimeout(r, 1000 * attempt));
        }
      }
    }

    if (!batchSuccess) {
      errorCount += batch.length;
      console.log(`❌ Batch ${batchNum} failed after ${MAX_RETRIES} attempts`);
    }

    // Delay between batches
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log('\n=================================');
  console.log('📊 Migration Summary');
  console.log('=================================');
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed:  ${errorCount}`);

  try {
    const { count: finalCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    console.log(`📦 Total in Supabase now: ${finalCount}`);
  } catch (err) {
    console.log('📦 Could not verify final count');
  }
  console.log('=================================\n');

  if (errorCount === 0) {
    console.log('🎉 Migration completed successfully!');
  } else if (successCount > 0) {
    console.log(`⚠️  Partial success — ${successCount} uploaded`);
    console.log('   Re-run to retry failed batches (upsert is safe)');
  } else {
    console.log('❌ Migration failed completely');
  }
}

main().catch((err) => {
  console.error('💥 Crash:', err.message);
  process.exit(1);
});