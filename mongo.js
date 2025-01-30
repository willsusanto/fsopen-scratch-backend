require('dotenv').config();

const mongoose = require('mongoose');
const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", true).connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean
})

const Note = mongoose.model('Note', noteSchema);
// const note = new Note({
//     content: 'Sebuah dokumen 3',
//     important: false
// });

// note.save().then(result => {
//     console.log(result);
//     console.log("Note is saved!");
//     mongoose.connection.close();
// })

Note.find({ content: { $exists: false }}).then(result => {
    result.forEach(note => {
        console.log(note);
    })
    mongoose.connection.close();
})