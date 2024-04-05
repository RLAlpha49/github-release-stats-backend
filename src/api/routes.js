const express = require('express')
const router = express.Router()
const statsController = require('./controllers/statsController')

router.post('/save-stats/:username/:repo', statsController.saveStats)
router.get('/get-stats/:username/:repo', statsController.getStats)

module.exports = router
