// models/Campo.js
// Schema Mongoose per i campi da calcio

const mongoose = require('mongoose');

// Definisco lo schema del campo da calcio
const campoSchema = new mongoose.Schema({
  
  nome: {
    type: String,
    required: [true, 'Nome del campo è obbligatorio'],
    trim: true
  },
  
  descrizione: {
    type: String,
    trim: true,
    maxlength: [500, 'Descrizione troppo lunga, massimo 500 caratteri']
  },
  
  citta: {
    type: String,
    required: [true, 'Città è obbligatoria'],
    trim: true
  },
  
  indirizzo: {
    type: String,
    trim: true
  },
  
  prezzo: {
    type: Number,
    min: [0, 'Il prezzo non può essere negativo']
  },
  
  immagine: {
    type: String,
    default: 'https://via.placeholder.com/400x300?text=Campo+Calcio'
  },
  
  gestore: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Gestore è obbligatorio']
  },
  
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
  
}, {
  timestamps: true
});

// Creo il model Campo dallo schema
const Campo = mongoose.model('Campo', campoSchema);

module.exports = Campo;