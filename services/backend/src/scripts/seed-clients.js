const { Client } = require('pg');

const url = 'postgresql://postgres.azlrpwmernlmovpedhmb:' + encodeURIComponent('Work7654321forMedia') + '@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';
const c = new Client({ connectionString: url });

const initialClients = [
  { name: 'OnlineGo', website: 'https://onlinego.in' },
  { name: 'Logistic', website: 'https://onlinego.in' },
  { name: 'PG.info', website: 'https://pginfo.in' },
  { name: 'CarHub', website: 'https://carhub.in' },
  { name: 'LiveSale.Fitness', website: 'https://livesale.fitness' },
  { name: 'AITourism', website: 'https://aitourism.in' },
  { name: 'BusinessExperts.Asia', website: 'https://businessexperts.asia' },
  { name: 'MobilePay.cafe', website: 'https://mobilepay.cafe' },
  { name: 'Lovenzea', website: 'https://lovenzea.com' },
  { name: 'WorknAi HRMS', website: 'https://worknaihrms.online' },
  { name: 'WorknAi.CRM', website: 'https://billpay.business' },
  { name: 'ShiftRide', website: 'https://shiftride.in' },
  { name: 'GoAirClass', website: 'https://goairclass.com' },
  { name: 'ITJIBX', website: 'https://itjobx.com' },
  { name: 'Raktdaan', website: 'https://raktdaan.online' },
];

async function seed() {
  await c.connect();
  // Clear any existing rows to prevent duplicates
  await c.query('DELETE FROM public.clients');

  for (const item of initialClients) {
    await c.query(
      'INSERT INTO public.clients (name, website) VALUES ($1, $2)',
      [item.name, item.website]
    );
  }

  const countRes = await c.query('SELECT COUNT(*) FROM public.clients');
  console.log('Seeded clients successfully. Total count:', countRes.rows[0].count);
  await c.end();
}

seed().catch(err => {
  console.error('Seed error:', err);
  c.end();
});
