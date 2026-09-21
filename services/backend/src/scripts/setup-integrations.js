require('dotenv').config();
const { Client } = require('pg');

async function setup() {
  const password = process.env.SUPABASE_DB_PASSWORD || 'Work7654321forMedia';
  const url = process.env.DATABASE_URL || ('postgresql://postgres.' + (process.env.SUPABASE_PROJECT_ID || 'azlrpwmernlmovpedhmb') + ':' + encodeURIComponent(password) + '@aws-0-ap-south-1.pooler.supabase.com:6543/postgres');
  console.log('Connecting to Supabase Postgres...');
  const client = new Client({ connectionString: url });
  await client.connect();

  const queries = [
    `CREATE TABLE IF NOT EXISTS public.social_integrations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      platform TEXT NOT NULL,
      account_id TEXT,
      account_name TEXT,
      access_token TEXT NOT NULL,
      app_id TEXT,
      connected BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );`,
    `ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS meta_post_id TEXT;`,
    `ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS publish_error TEXT;`,
    `NOTIFY pgrst, 'reload schema';`
  ];

  for (const q of queries) {
    try {
      await client.query(q);
      console.log('Query succeeded');
    } catch (err) {
      console.warn('Query note:', err.message);
    }
  }

  // Insert or update the Instagram integration
  const token = 'IGAAZAZAbXDOfLFBZAGFRUW5RMmlNWHVNZAzdCLXBtZAU5ITFY1eUJ6WUszX0VYOFR4Q1BJYWdnQVlGRGVKWk1SQ2FRVlVYVlVWMkhwZA3Q1S0owWXVCenh4ZADhtY1FCUEpBRUxhdjhiMnlmVkxDcjRnLWdNekRlcFBxNW1vU0dCcXVtWQZDZD';
  const accountId = '28517787071171649';
  const accountName = 'worknaiintern1';
  const appId = '1054238947409813';

  // Check if exists
  const existing = await client.query(`SELECT id FROM public.social_integrations WHERE platform = 'instagram' AND account_id = $1`, [accountId]);
  if (existing.rows.length === 0) {
    await client.query(`
      INSERT INTO public.social_integrations (platform, account_id, account_name, access_token, app_id, connected)
      VALUES ('instagram', $1, $2, $3, $4, true)
    `, [accountId, accountName, token, appId]);
    console.log('✅ Instagram integration inserted into social_integrations');
  } else {
    await client.query(`
      UPDATE public.social_integrations
      SET access_token = $1, account_name = $2, app_id = $3, connected = true, updated_at = NOW()
      WHERE platform = 'instagram' AND account_id = $4
    `, [token, accountName, appId, accountId]);
    console.log('✅ Instagram integration updated in social_integrations');
  }

  await client.end();
  console.log('Database setup complete.');
}

setup().catch(console.error);
