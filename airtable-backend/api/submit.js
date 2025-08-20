const Airtable = require('airtable');

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_API_KEY, // set this in Vercel environment variables
});

const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
const tableName = process.env.AIRTABLE_TABLE_NAME;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  try {
    const created = await base(tableName).create({
      Name: name,
      Email: email,
    });

    return res.status(200).json({ success: true, id: created.id });
  } catch (error) {
    console.error('Airtable error:', error);
    return res.status(500).json({ error: 'Failed to create record in Airtable.' });
  }
};
