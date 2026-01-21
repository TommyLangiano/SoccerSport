// routes/campi.js
// Routing per campi da calcio

const express = require('express');
const campiController = require('../controllers/campiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/campi - Ottieni tutti i campi (pubblico)
router.get('/', campiController.getAllCampi);

// POST /api/campi - Crea un nuovo campo (protetto, solo gestore)
router.post('/', protect, campiController.createCampo);

// GET /api/campi/:id - Ottieni un campo specifico (pubblico)
router.get('/:id', campiController.getCampoById);

// PUT /api/campi/:id - Aggiorna un campo (protetto, solo proprietario)
router.put('/:id', protect, campiController.updateCampo);

// DELETE /api/campi/:id - Elimina un campo (protetto, solo proprietario)
router.delete('/:id', protect, campiController.deleteCampo);

// POST /api/campi/:id/like - Metti/togli like (protetto)
router.post('/:id/like', protect, campiController.likeCampo);

module.exports = router;