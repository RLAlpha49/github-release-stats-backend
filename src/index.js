require('dotenv').config()
const express = require('express')
const routes = require('./api/routes')
const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = process.env.MONGODB_URI

const { logger, corsHandler, jsonParser, errorHandler, logRequestUrl } = require('./utils/middleware')

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

const app = express()

app.use(logger)
app.use(corsHandler)
app.use(jsonParser)
app.use(errorHandler)
app.use(logRequestUrl)
app.use('/api', routes)

async function run () {
  try {
    await client.connect()
    await client.db('admin').command({ ping: 1 })
    console.log('Pinged your deployment. You successfully connected to MongoDB!')

    // Start the server
    const port = process.env.PORT || 3000
    const server = app.listen(port, () => { // Assign the server instance to the server variable
      console.log(`Server is running on port ${port}`)
    })

    return server // Return the server instance
  } catch (error) {
    console.error(error)
  }
}

module.exports = { run, client }
