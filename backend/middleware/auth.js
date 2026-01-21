// middleware/auth.js
// Questo middleware verifica se l'utente è autenticato tramite JWT

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Funzione che controlla se l'utente ha un token valido
const protect = async (req, res, next) => {
  
  // Controllo se c'è l'header Authorization nella richiesta HTTP
  const headerAuthorization = req.headers.authorization;
  
  if (!headerAuthorization || !headerAuthorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Accesso negato. Token mancante.' });
  }
  
  // Estraggo il token dalla stringa "Bearer TOKEN_QUI"
  // Divido la stringa e prendo la seconda parte [1]
  const tokenJWT = headerAuthorization.split(' ')[1];
  
  try {
    // Verifico il token usando la chiave segreta JWT_SECRET
    const tokenDecodificato = jwt.verify(tokenJWT, process.env.JWT_SECRET);
    
    // Cerco l'utente nel database usando l'ID nel token
    // select('-password') esclude la password dal risultato
    const utenteLoggato = await User.findById(tokenDecodificato.id).select('-password');
    
    if (!utenteLoggato) {
      return res.status(401).json({ message: 'Utente non trovato' });
    }
    
    // Aggiungo l'utente alla richiesta così le altre funzioni possono usarlo
    req.user = utenteLoggato;
    
    // Tutto ok, passo alla prossima funzione
    next();
    
  } catch (errore) {
    return res.status(401).json({ message: 'Token non valido o scaduto' });
  }
};

module.exports = { protect };