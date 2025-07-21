import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base(process.env.AIRTABLE_BASE_ID);
const table = process.env.AIRTABLE_TABLE_NAME || 'PrefilledKeys';

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const keys = new Set();

  try {
    // Check for required environment variables
    if (!process.env.AIRTABLE_TOKEN || !process.env.AIRTABLE_BASE_ID) {
      return res.status(500).json({ 
        error: 'Missing required environment variables: AIRTABLE_TOKEN or AIRTABLE_BASE_ID' 
      });
    }

    await base(table)
      .select()
      .eachPage((records, fetchNextPage) => {
        records.forEach((r) => {
          const key = r.get('Key');
          if (key) keys.add(key);
        });
        fetchNextPage();
      });

    res.status(200).json({ keys: Array.from(keys) });
  } catch (err) {
    console.error('Airtable error:', err);
    res.status(500).json({ 
      error: 'Failed to fetch from Airtable',
      details: err.message 
    });
  }
}
