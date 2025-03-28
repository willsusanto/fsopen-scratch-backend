const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const Note = require('../models/note')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

/* npm run test -- --test-name-pattern="notes" to execute specific tests */

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
  }
]

beforeEach(async () => {
  await Note.deleteMany({})
  let noteObject = new Note(initialNotes[0])
  await noteObject.save()
  noteObject = new Note(initialNotes[1])
  await noteObject.save()
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are 2 notes', async () => {
  const notes = await api.get('/api/notes')

  assert.strictEqual(notes.body.length, initialNotes.length)
})

test('notes contain about javascript', async () => {
  const notes = await api.get('/api/notes')
  const contents = notes.body.map(note => note.content)

  assert(contents.some(content => content.toLowerCase().includes('javascript')))
})

after(async () => {
  await mongoose.connection.close()
})
