const express = require('express')
const { strictLimiter, lessStrictLimiter } = require('../utils/middleware')
const statsController = require('./controllers/statsController')

const router = express.Router()

// Apply the strict rate limiter to the /api/save-stats route
router.post('/save-stats/:username/:repo', strictLimiter, statsController.saveStats)

// Apply the less strict rate limiter to other routes
router.get('/get-stats/:username/:repo', lessStrictLimiter, statsController.getStats)

module.exports = router
