require('dotenv').config()

const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

mongoose.set('strictQuery', true).connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean
},
{
  toObject: {
    transform: function (document) {
      return {
        id: document._id,
        content: document.content,
        important: document.important
      }
    }
  }
}
)

const Note = mongoose.model('Note', noteSchema)
// const note = new Note({
//     content: 'Sebuah dokumen 3',
//     important: false
// });

// note.save().then(result => {
//     console.log(result);
//     console.log("Note is saved!");
//     mongoose.connection.close();
// })

Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})