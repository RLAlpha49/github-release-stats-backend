const express = require('express');
const router = express.Router();
const statsController = require('./controllers/statsController');

// Define your routes here
router.post('/save-stats/:repo', statsController.saveStats);
router.get('/get-stats/:repo', statsController.getStats);

module.exports = router;