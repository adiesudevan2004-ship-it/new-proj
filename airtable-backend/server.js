require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const Airtable = require('airtable');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000; 

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); 

// Airtable configuration
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIRTABLE_API_KEY,
});

const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
const tableName = process.env.AIRTABLE_TABLE_NAME;

// Routes
app.post('/submit', async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: "Name and email required." });
    }

    try {
        const created = await base(tableName).create({
            Name: name,
            Email: email,
        });

        res.status(200).json({ success: true, id: created.id });
    } catch (err) {
        console.error("Airtable error:", err);
        res.status(500).json({ error: "Airtable request failed." });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
