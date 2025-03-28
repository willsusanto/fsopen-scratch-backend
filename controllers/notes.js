const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  return response.json(notes)
})

notesRouter.get('/:id', async (request, response, next) => {
  const id = request.params.id

  try {
    const note = await Note.findById(id).exec()

    if (note === null) {
      return response.status(404).json({
        'messsage': 'Resource not found.'
      })
    }

    return response.json(note)
  } catch (error) {
    next(error)
  }
})

notesRouter.post('/', async (request, response, next) => {
  const note = request.body

  const newNote = new Note ({
    content: note.content,
    important: Boolean(note.important) || false
  })

  try {
    const createdNote = await newNote.save()
    return response.status(201).json(createdNote)
  } catch (error) {
    next(error)
  }
})

notesRouter.put('/:id', async (request, response, next) => {
  const id = request.params.id
  const { content, important } = request.body

  try {
    const result = await Note.findByIdAndUpdate(id,
      { content, important },
      { new: true, runValidators: true, context: 'query' }).exec()

    return response.json(result)
  } catch (error) {
    next(error)
  }
})

notesRouter.delete('/:id', async (request, response, next) => {
  const id = request.params.id

  try {
    const deleteResult = await Note.findByIdAndDelete(id).exec()
    if (deleteResult === null) {
      return response.status(404).json({
        'messsage': 'Resource not found.'
      })
    }
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = notesRouter