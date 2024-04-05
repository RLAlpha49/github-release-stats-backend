require('dotenv').config()
const express = require('express')
const routes = require('./api/routes')
const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = process.env.MONGODB_URI

const { logger, corsHandler, jsonParser, errorHandler, limiter } = require('./utils/middleware')

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

const app = express()

app.use(logger) // Use the logger middleware
app.use(corsHandler) // Use the CORS handler middleware
app.use(jsonParser) // Use the JSON parser middleware
app.use(errorHandler) // Use the error handler middleware
app.use('/api', limiter, routes) // Use the rate limiter middleware

async function run () {
  try {
    await client.connect()
    await client.db('admin').command({ ping: 1 })
    console.log('Pinged your deployment. You successfully connected to MongoDB!')

    // Start the server
    const port = process.env.PORT || 3000
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close()
  }
}

run().catch(console.dir)
