const mongoose = require('mongoose');
mongoose.set("strictQuery", true);

const url = process.env.MONGODB_URI;

console.log("Connecting to MongoDB at ", url);

mongoose.connect(url)
    .then(result => {
        console.log("Connected to MongoDB!");
    }).catch(error => {
        console.error("ERROR: Failed to connect!", error);
    });

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean
})

noteSchema.set("toJSON", {
    transform: function (document, returnedObject) {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;