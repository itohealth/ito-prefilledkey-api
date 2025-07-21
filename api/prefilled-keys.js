import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base(process.env.AIRTABLE_BASE_ID);
const table = process.env.AIRTABLE_TABLE_NAME || 'PrefilledKeys';

export default async function handler(req, res) {
  const keys = new Set();

  try {
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
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch from Airtable' });
  }
}
