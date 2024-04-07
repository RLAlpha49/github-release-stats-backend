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
  console.error(err.stack || err.message || err)
  res.status(500).json({ message: 'Something broke!' })
}

// Define a strict rate limit rule
const strictLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: 'Too many requests from this IP, please try again after 5 minutes'
})

// Define a less strict rate limit rule
const lessStrictLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 10 minutes'
})

function logRequestUrl (req, res, next) {
  console.log('Requested URL:', req.url)
  next()
}

module.exports = {
  logger,
  corsHandler,
  jsonParser,
  errorHandler,
  strictLimiter,
  lessStrictLimiter,
  logRequestUrl
}
