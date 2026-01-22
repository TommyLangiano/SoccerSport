// controllers/campiController.js
// Logica per gestione campi da calcio: CRUD + like

const Campo = require('../models/Campo');

const DEFAULT_IMAGE = 'https://www.sporteimpianti.it/wp-content/uploads/2022/03/futsal-banner-mast-pero.jpg';

// Ottieni tutti i campi
exports.getAllCampi = async (req, res) => {
  try {
    const campi = await Campo.find()
      .populate('gestore', 'username email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      count: campi.length,
      campi: campi
    });
  } catch (errore) {
    res.status(500).json({ message: 'Errore nel recupero dei campi' });
  }
};

// Ottieni un singolo campo per ID
exports.getCampoById = async (req, res) => {
  try {
    const campoTrovato = await Campo.findById(req.params.id)
      .populate('gestore', 'username email')
      .populate('likes', 'username');
    
    if (!campoTrovato) {
      return res.status(404).json({ message: 'Campo non trovato' });
    }
    
    res.status(200).json(campoTrovato);
  } catch (errore) {
    if (errore.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID del campo non valido' });
    }
    res.status(500).json({ message: 'Errore nel recupero del campo' });
  }
};

// Crea un nuovo campo
exports.createCampo = async (req, res) => {
  try {
    if (req.user.ruolo !== 'gestore') {
      return res.status(403).json({ message: 'Solo i gestori possono creare campi' });
    }
    
    const { nome, descrizione, citta, indirizzo, prezzo, immagine } = req.body;
    
    if (!nome || !citta) {
      return res.status(400).json({ message: 'Nome e città sono obbligatori' });
    }
    
    const nuovoCampo = await Campo.create({
      nome: nome,
      descrizione: descrizione,
      citta: citta,
      indirizzo: indirizzo,
      prezzo: prezzo,
      immagine: immagine || DEFAULT_IMAGE,
      gestore: req.user._id
    });
    
    const campoPopolato = await Campo.findById(nuovoCampo._id)
      .populate('gestore', 'username email');
    
    res.status(201).json({ 
      message: 'Campo creato con successo', 
      campo: campoPopolato 
    });
  } catch (errore) {
    if (errore.name === 'ValidationError') {
      const messages = Object.values(errore.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    res.status(500).json({ 
      message: 'Errore nella creazione del campo', 
      errore: errore.message 
    });
  }
};

// Aggiorna un campo
exports.updateCampo = async (req, res) => {
  try {
    const campoTrovato = await Campo.findById(req.params.id);
    
    if (!campoTrovato) {
      return res.status(404).json({ message: 'Campo non trovato' });
    }
    
    if (campoTrovato.gestore.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Non puoi modificare questo campo' });
    }
    
    const { nome, descrizione, citta, indirizzo, prezzo, immagine } = req.body;
    
    campoTrovato.nome = nome || campoTrovato.nome;
    campoTrovato.descrizione = descrizione || campoTrovato.descrizione;
    campoTrovato.citta = citta || campoTrovato.citta;
    campoTrovato.indirizzo = indirizzo || campoTrovato.indirizzo;
    campoTrovato.prezzo = prezzo || campoTrovato.prezzo;
    campoTrovato.immagine = immagine || campoTrovato.immagine || DEFAULT_IMAGE;
    
    const campoAggiornato = await campoTrovato.save();
    const campoPopolato = await Campo.findById(campoAggiornato._id)
      .populate('gestore', 'username email');
    
    res.status(200).json({ 
      message: 'Campo aggiornato con successo', 
      campo: campoPopolato 
    });
  } catch (errore) {
    if (errore.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID del campo non valido' });
    }
    res.status(500).json({ message: 'Errore nella modifica del campo' });
  }
};

// Elimina un campo
exports.deleteCampo = async (req, res) => {
  try {
    const campoTrovato = await Campo.findById(req.params.id);
    
    if (!campoTrovato) {
      return res.status(404).json({ message: 'Campo non trovato' });
    }
    
    if (campoTrovato.gestore.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Non puoi eliminare questo campo' });
    }
    
    await Campo.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Campo eliminato con successo' });
  } catch (errore) {
    if (errore.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID del campo non valido' });
    }
    res.status(500).json({ message: 'Errore nella eliminazione del campo' });
  }
};

// Metti o togli like a un campo
exports.likeCampo = async (req, res) => {
  try {
    const campoTrovato = await Campo.findById(req.params.id);
    
    if (!campoTrovato) {
      return res.status(404).json({ message: 'Campo non trovato' });
    }
    
    const utenteId = req.user._id;
    const indexLike = campoTrovato.likes.findIndex(id => id.toString() === utenteId.toString());
    
    if (indexLike === -1) {
      campoTrovato.likes.push(utenteId);
    } else {
      campoTrovato.likes = campoTrovato.likes.filter(id => id.toString() !== utenteId.toString());
    }
    
    await campoTrovato.save();
    
    const campoPopolato = await Campo.findById(campoTrovato._id)
      .populate('gestore', 'username email')
      .populate('likes', 'username');
    
    res.status(200).json({
      message: 'Operazione like/unlike completata',
      liked: indexLike === -1,
      likesCount: campoTrovato.likes.length,
      campo: campoPopolato
    });
  } catch (errore) {
    if (errore.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID del campo non valido' });
    }
    res.status(500).json({ message: 'Errore nella gestione del like' });
  }
};