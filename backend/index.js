require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');  

const routes = require('./routes/drug.route');

const app = express();

app.use(cors());
app.use(express.json()); 

// Connect to MongoDB
connectDB(); 

// Routes
app.get('/', (req, res) => {
  res.send('Backend is running...');
});
app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

});