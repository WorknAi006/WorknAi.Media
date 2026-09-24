require('dotenv').config();
const { Client } = require('pg');

async function migrate() {
  const password = process.env.SUPABASE_DB_PASSWORD || 'Work7654321forMedia';
  const url = process.env.DATABASE_URL || ('postgresql://postgres.' + (process.env.SUPABASE_PROJECT_ID || 'azlrpwmernlmovpedhmb') + ':' + encodeURIComponent(password) + '@aws-0-ap-south-1.pooler.supabase.com:6543/postgres');
  
  console.log('🔄 Connecting to Supabase Postgres to migrate social_integrations...');
  const client = new Client({ connectionString: url });
  await client.connect();

  const migrationQueries = [
    // 1. Add required fields if missing
    `ALTER TABLE public.social_integrations ADD COLUMN IF NOT EXISTS brand_id BIGINT;`,
    `ALTER TABLE public.social_integrations ADD COLUMN IF NOT EXISTS instagram_id TEXT;`,
    `ALTER TABLE public.social_integrations ADD COLUMN IF NOT EXISTS username TEXT;`,
    `ALTER TABLE public.social_integrations ADD COLUMN IF NOT EXISTS display_name TEXT;`,
    `ALTER TABLE public.social_integrations ADD COLUMN IF NOT EXISTS profile_picture TEXT;`,
    `ALTER TABLE public.social_integrations ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;`,
    `ALTER TABLE public.social_integrations ADD COLUMN IF NOT EXISTS connected_at TIMESTAMPTZ DEFAULT NOW();`,
    `ALTER TABLE public.social_integrations ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT false;`,
    `ALTER TABLE public.social_integrations ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'connected';`,
    
    // 2. Add foreign key to clients table if not exists
    `DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_social_integrations_brand'
      ) THEN
        ALTER TABLE public.social_integrations 
        ADD CONSTRAINT fk_social_integrations_brand 
        FOREIGN KEY (brand_id) REFERENCES public.clients(id) ON DELETE SET NULL;
      END IF;
    END $$;`,

    // 3. Backfill existing records for compatibility
    `UPDATE public.social_integrations
     SET 
       instagram_id = COALESCE(instagram_id, account_id),
       username = COALESCE(username, account_name),
       display_name = COALESCE(display_name, account_name),
       is_primary = COALESCE(is_primary, is_default, false),
       connected_at = COALESCE(connected_at, created_at, NOW()),
       status = CASE WHEN connected = false THEN 'disconnected' ELSE 'connected' END
     WHERE instagram_id IS NULL OR username IS NULL;`,

    // 4. Reload PostgREST schema cache
    `NOTIFY pgrst, 'reload schema';`
  ];

  for (const q of migrationQueries) {
    try {
      await client.query(q);
      console.log('✅ Query executed successfully');
    } catch (err) {
      console.warn('⚠️ Query notice:', err.message);
    }
  }

  // Check columns after migration
  const res = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'social_integrations'
    ORDER BY ordinal_position;
  `);
  console.log('📊 Current social_integrations columns:');
  console.table(res.rows);

  await client.end();
  console.log('🎉 Database migration complete!');
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
