// controllers/authController.js
// Logica per autenticazione: registrazione, login, dati utente

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registrazione nuovo utente
exports.register = async (req, res) => {
  try {
    const { username, email, password, ruolo } = req.body;
    
    const utenteEsistente = await User.findOne({ email: email });
    if (utenteEsistente) {
      return res.status(400).json({ message: 'Email già registrata' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const passwordHashata = await bcrypt.hash(password, salt);
    
    const nuovoUtente = await User.create({
      username: username,
      email: email,
      password: passwordHashata,
      ruolo: ruolo || 'user'
    });
    
    const token = jwt.sign(
      { id: nuovoUtente._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.status(201).json({
      token: token,
      user: {
        id: nuovoUtente._id,
        username: nuovoUtente.username,
        email: nuovoUtente.email,
        ruolo: nuovoUtente.ruolo
      }
    });
    
  } catch (errore) {
    res.status(500).json({ 
      message: 'Errore durante la registrazione', 
      errore: errore.message 
    });
  }
};

// Login utente
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const utenteTrovato = await User.findOne({ email: email });
    if (!utenteTrovato) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }
    
    const passwordCorretta = await bcrypt.compare(password, utenteTrovato.password);
    if (!passwordCorretta) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }
    
    const token = jwt.sign(
      { id: utenteTrovato._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.status(200).json({
      token: token,
      user: {
        id: utenteTrovato._id,
        username: utenteTrovato.username,
        email: utenteTrovato.email,
        ruolo: utenteTrovato.ruolo
      }
    });
    
  } catch (errore) {
    res.status(500).json({ 
      message: 'Errore durante il login', 
      errore: errore.message 
    });
  }
};

// Ottieni dati utente loggato
exports.getMe = async (req, res) => {
  try {
    res.status(200).json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        ruolo: req.user.ruolo
      }
    });
  } catch (errore) {
    res.status(500).json({ message: 'Errore nel recupero dati utente' });
  }
};