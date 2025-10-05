
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

connectDB();

app.use(cors({
  origin: "https://ukpfm.netlify.app",   // your Netlify frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));