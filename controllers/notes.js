const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

notesRouter.get('/:id', (request, response, next) => {
  const id = request.params.id

  Note.findById(id).exec()
    .then(result => {
      if (result === null) {
        return response.status(404).json({
          'messsage': 'Resource not found.'
        })
      }

      response.json(result)
    })
    .catch(error => next(error))
})

notesRouter.post('/', (request, response, next) => {
  const note = request.body

  const newNote = new Note ({
    content: note.content,
    important: Boolean(note.important) || false
  })

  newNote.save()
    .then(() => {
      response.status(201).json(newNote)
    })
    .catch(error => next(error))
})

notesRouter.put('/:id', (request, response, next) => {
  const id = request.params.id
  const { content, important }= request.body

  Note.findByIdAndUpdate(id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }).exec()
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})

notesRouter.delete('/:id', (request, response, next) => {
  const id = request.params.id

  Note.findByIdAndDelete(id).exec()
    .then(result => {
      if (result === null) {
        return response.status(404).json({
          'messsage': 'Resource not found.'
        })
      }

      response.status(204).end()
    })
    .catch(error => next(error))
})

module.exports = notesRouter