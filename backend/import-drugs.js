
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Drug = require('./model/drug.model');
const connectDB = require('./config/db');

async function importDrugs() {
  try {
    await connectDB();
    console.log('MongoDB connected');

    const filePath = path.join(__dirname, 'drugData.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    const drugs = JSON.parse(raw);

    if (!Array.isArray(drugs)) throw new Error('JSON must be an array');


    await Drug.deleteMany({});
    console.log('Old data cleared');

    const cleanDrugs = drugs.map(d => ({
      ...d,
      launchDate: new Date(d.launchDate)
    }));

    await Drug.insertMany(cleanDrugs);

    console.log(`SUCCESS! ${cleanDrugs.length} `);

    mongoose.connection.close();
  } catch (err) {
    console.error('Import failed:', err.message);
    process.exit(1);
  }
}

importDrugs();