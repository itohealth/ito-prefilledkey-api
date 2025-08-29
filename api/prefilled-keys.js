import Airtable from 'airtable';


export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // or your validator origin
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    const { AIRTABLE_PAT, AIRTABLE_BASE, AIRTABLE_TABLE } = process.env;
    if (!AIRTABLE_PAT || !AIRTABLE_BASE || !AIRTABLE_TABLE) throw new Error('Missing env vars');

    const base = new Airtable({ apiKey: AIRTABLE_PAT }).base(AIRTABLE_BASE);
    const records = await base(AIRTABLE_TABLE).select({ fields: ['Key'] }).all();

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({
      keys: records.map(r => r.get('Key')).filter(Boolean),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err?.message || err) });
  }
}
