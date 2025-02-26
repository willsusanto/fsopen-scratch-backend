const logger = require('./utils/logger')

const requestLogger = (request, response, next) => {
  logger.info('Method :',request.method)
  logger.info('Body :', request.body)
  logger.info('Path :', request.path)
  logger.info('Time :', Date())
  logger.info('-----------------')

  next()
}

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: 'Unknown endpoint.' })
  next()
}

const errorHandler = (error, request, response, next) => {
  logger.error('ERROR: ', error.message)

  const errorMappings = {
    'CastError': () => response.status(400).json({ message: 'Invalid format.' }),
    'ValidationError': () => response.status(400).json({ message: error.message })
  }

  if (errorMappings[error.name]) {
    return errorMappings[error.name]()
  }

  next(error)
}

module.exports = { requestLogger, unknownEndpoint, errorHandler }