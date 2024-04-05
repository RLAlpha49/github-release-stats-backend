const express = require('express')
const rateLimit = require('express-rate-limit')
const morgan = require('morgan')
const cors = require('cors')

// Middleware for logging
const logger = morgan('dev')

// Middleware for enabling CORS
const corsHandler = cors()

// Middleware for parsing JSON bodies
const jsonParser = express.json()

// Error handling middleware
const errorHandler = (err, req, res) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
}

// Define a rate limit rule
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 10 minutes'
})

module.exports = {
  logger,
  corsHandler,
  jsonParser,
  errorHandler,
  limiter
}
