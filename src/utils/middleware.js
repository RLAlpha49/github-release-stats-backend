const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

// Middleware for logging
const logger = morgan('dev')

// Middleware for enabling CORS
const corsHandler = cors()

// Middleware for parsing JSON bodies
const jsonParser = express.json()

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
}

module.exports = {
  logger,
  corsHandler,
  jsonParser,
  errorHandler
}
