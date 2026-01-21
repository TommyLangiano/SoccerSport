// config/db.js
// Funzione per connettere il database MongoDB

const mongoose = require('mongoose');

// Funzione asincrona per la connessione a MongoDB
const connectDB = async () => {
  try {
    // Tento la connessione usando l'URI dal file .env
    const connessione = await mongoose.connect(process.env.MONGO_URI);
    
    // Se la connessione va a buon fine, non mostro nulla
    // In produzione è meglio non stampare troppi log
    
  } catch (errore) {
    // Se c'è un errore, lo mostro e fermo il server
    return res.status(500).json({ message: 'Errore di connessione al database' });
    process.exit(1);
  }
};

module.exports = connectDB;