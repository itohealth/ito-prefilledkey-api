import Airtable from 'airtable';


export default async function handler(req, res) {

  console.log({
    AIRTABLE_PAT: !!process.env.AIRTABLE_PAT,
    AIRTABLE_BASE: process.env.AIRTABLE_BASE,
    AIRTABLE_TABLE: process.env.AIRTABLE_TABLE,
  });

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    return res.status(204).end();
  }

  try {
    const { AIRTABLE_PAT, AIRTABLE_BASE, AIRTABLE_TABLE } = process.env;
    if (!AIRTABLE_PAT) throw new Error('Missing env vars');

    const base = new Airtable({ apiKey: AIRTABLE_PAT }).base(AIRTABLE_BASE);
    const records = await base(AIRTABLE_TABLE)
      .select({ fields: ['key'] })
      .all();

    res
      .setHeader('Access-Control-Allow-Origin', '*')
      .status(200)
      .json({ keys: records.map(r => r.get('key')).filter(Boolean) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
