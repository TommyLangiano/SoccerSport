// routes/auth.js
// Routing per autenticazione

const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register - Registrazione nuovo utente
router.post('/register', authController.register);

// POST /api/auth/login - Login utente
router.post('/login', authController.login);

// GET /api/auth/me - Ottieni dati utente loggato (protetta)
router.get('/me', protect, authController.getMe);

module.exports = router;