require('dotenv').config()

const express = require ('express')
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const config = require('./utils/config')
const logger = require('./utils/logger')
const { requestLogger, unknownEndpoint, errorHandler } = require('./utils/middleware')
const mongoose = require('mongoose')
const app = express()

mongoose.set('strictQuery', true)
logger.info('Connecting to MongoDB at ', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB!')
  }).catch(error => {
    logger.error('ERROR: Failed to connect!', error)
  })

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
}

app.use(express.static('dist'))
app.use(express.json())
app.use(cors(corsOptions))
app.use(requestLogger)

app.use('/api/notes', notesRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app