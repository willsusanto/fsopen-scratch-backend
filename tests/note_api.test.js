const { test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are 2 notes', async () => {
  const notes = await api.get('/api/notes')

  assert.strictEqual(notes.body.length, 2)
})

test('notes contain about javascript', async () => {
  const notes = await api.get('/api/notes')
  const contents = notes.body.map(note => note.content)

  assert(contents.some(content => content.toLowerCase().includes('javascript')))
})

after(async () => {
  await mongoose.connection.close()
})
