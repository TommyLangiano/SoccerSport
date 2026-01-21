// models/User.js
// Schema Mongoose per gli utenti del sistema

const mongoose = require('mongoose');

// Definisco lo schema dell'utente
const userSchema = new mongoose.Schema({
  
  username: {
    type: String,
    required: [true, 'Username è obbligatorio'],
    unique: true,
    trim: true,
    minlength: [3, 'Username deve avere almeno 3 caratteri']
  },
  
  email: {
    type: String,
    required: [true, 'Email è obbligatoria'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email non valida']
  },
  
  password: {
    type: String,
    required: [true, 'Password è obbligatoria'],
    minlength: [6, 'Password deve avere almeno 6 caratteri']
  },
  
  ruolo: {
    type: String,
    enum: ['user', 'gestore'],
    default: 'user'
  }
  
}, {
  timestamps: true
});

// Creo il model User dallo schema
const User = mongoose.model('User', userSchema);

module.exports = User;