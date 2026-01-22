// controllers/authController.js
// Logica per autenticazione: registrazione, login, dati utente

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");

// Registrazione nuovo utente
exports.register = async (req, res) => {
  try {
    const { username, email, password, ruolo } = req.body;

    const utenteEsistente = await User.findOne({ email: email });
    if (utenteEsistente) {
      return res.status(400).json({ message: "Email già registrata" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHashata = await bcrypt.hash(password, salt);

    const nuovoUtente = await User.create({
      username: username,
      email: email,
      password: passwordHashata,
      ruolo: ruolo || "user",
    });

    // Genera access token (breve durata - 15 minuti)
    const accessToken = jwt.sign(
      { id: nuovoUtente._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    // Genera refresh token (lunga durata - 7 giorni)
    const refreshToken = jwt.sign(
      { id: nuovoUtente._id },
      process.env.JWT_REFRESH,
      { expiresIn: "7d" },
    );

    // Salva refresh token nel database
    await RefreshToken.create({
      token: refreshToken,
      userId: nuovoUtente._id,
    });

    res.status(201).json({
      token: accessToken,
      refreshToken: refreshToken,
      user: {
        id: nuovoUtente._id,
        username: nuovoUtente.username,
        email: nuovoUtente.email,
        ruolo: nuovoUtente.ruolo,
      },
    });
  } catch (errore) {
    res.status(500).json({
      message: "Errore durante la registrazione",
      errore: errore.message,
    });
  }
};

// Login utente
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const utenteTrovato = await User.findOne({ email: email });
    if (!utenteTrovato) {
      return res.status(401).json({ message: "Credenziali non valide" });
    }

    const passwordCorretta = await bcrypt.compare(
      password,
      utenteTrovato.password,
    );
    if (!passwordCorretta) {
      return res.status(401).json({ message: "Credenziali non valide" });
    }

    // Genera access token (breve durata - 15 minuti)
    const accessToken = jwt.sign(
      { id: utenteTrovato._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    // Genera refresh token (lunga durata - 7 giorni)
    const refreshToken = jwt.sign(
      { id: utenteTrovato._id },
      process.env.JWT_REFRESH,
      { expiresIn: "7d" },
    );

    // Salva refresh token nel database
    await RefreshToken.create({
      token: refreshToken,
      userId: utenteTrovato._id,
    });

    res.status(200).json({
      token: accessToken,
      refreshToken: refreshToken,
      user: {
        id: utenteTrovato._id,
        username: utenteTrovato.username,
        email: utenteTrovato.email,
        ruolo: utenteTrovato.ruolo,
      },
    });
  } catch (errore) {
    res.status(500).json({
      message: "Errore durante il login",
      errore: errore.message,
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
        ruolo: req.user.ruolo,
      },
    });
  } catch (errore) {
    res.status(500).json({ message: "Errore nel recupero dati utente" });
  }
};

// Refresh token - rinnova access token usando refresh token
exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token mancante" });
    }

    // Verifica che il refresh token esista nel database
    const tokenDoc = await RefreshToken.findOne({ token: refreshToken });
    if (!tokenDoc) {
      return res.status(401).json({ message: "Refresh token non valido" });
    }

    // Verifica che il token JWT sia valido
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH);

    // Genera nuovo access token
    const nuovoAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    // Genera nuovo refresh token (rotazione)
    const nuovoRefreshToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_REFRESH,
      { expiresIn: "7d" },
    );

    // Elimina il vecchio refresh token
    await RefreshToken.deleteOne({ token: refreshToken });

    // Salva il nuovo refresh token
    await RefreshToken.create({
      token: nuovoRefreshToken,
      userId: decoded.id,
    });

    res.status(200).json({
      token: nuovoAccessToken,
      refreshToken: nuovoRefreshToken,
    });
  } catch (errore) {
    res.status(401).json({ message: "Refresh token scaduto o non valido" });
  }
};

// Logout - rimuove refresh token dal database
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Rimuovi refresh token dal database
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    res.status(200).json({ message: "Logout effettuato con successo" });
  } catch (errore) {
    res.status(500).json({ message: "Errore durante il logout" });
  }
};
