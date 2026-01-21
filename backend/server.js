// server.js
// Entry point del backend - avvia il server Express

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Importo le routes
const authRoutes = require('./routes/auth');
const campiRoutes = require('./routes/campi');

// Carico le variabili d'ambiente dal file .env
dotenv.config();

// Connetto il database MongoDB
connectDB();

// Creo l'applicazione Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rotta di test
app.get('/', (req, res) => {
  res.json({ message: 'Benvenuto alle API di CampiCalcio Italia' });
});

// Registro le routes
app.use('/api/auth', authRoutes);
app.use('/api/campi', campiRoutes);

// Avvio il server sulla porta specificata
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  // Server avviato
});