require('dotenv').config();

const express = require ('express');
const cors = require('cors');
const { Note, isValidObjectId } = require('./models/note');
const app = express();

const requestLogger = (request, response, next) => {
    console.log("Method :",request.method);
    console.log("Body :", request.body);
    console.log("Path :", request.path);
    console.log("Time :", Date());

    next();
}

const unknownEndpoint = (request, response, next) => {
    response.status(404).send({ error: "Unknown endpoint." });
    next();
}

const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200
}

app.use(express.json())
app.use(cors(corsOptions));
app.use(express.static("dist"));
app.use(requestLogger);

let notes = [
    {
        id: "1",
        content: "HTML is easy, right?",
        important: true
    },
    {
        id: "2",
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: "3",
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
];

app.get("/", (request, response) => {
    console.log(request);
    response.status(200).send("<h1>Hello world, this is the default route!</h1>");
})

app.get("/api/notes/:id", (request, response) => {
    const id = request.params.id;

    if (!isValidObjectId(id)) {
        return response.status(400).json({
            "messsage": "Invalid id format."
        });
    }

    const findNote = Note.findById(id).exec()
        .then(result => {
            if (result === null) {
                return response.status(404).json({
                    "messsage": "Resource not found."
                });
            }

            response.json(result);
        })
        .catch(error => {
            console.log(error);
            return response.status(500);
        });
})

app.get("/api/notes", (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes);
    })
})

app.post("/api/notes", (request, response) => {
    const note = request.body;
    
    if (!note || Object.entries(note).length === 0) {
        return response.status(400).json({
            "messsage": "Bad request."
        });
    }

    if (note.content == null || note.content.trim() === "") {
        return response.status(400).json({
            "messsage": "Content must not be empty."
        });
    }

    const newNote = new Note ({
        content: note.content,
        important: Boolean(note.important) ?? false
    });

    newNote.save()
        .then(result => {
            response.status(201).json(newNote);
        })
        .catch(error => {
            console.error("ERROR: Failed to save! ", error);
            response.status(500);
        })
})

app.delete("/api/notes/:id", (request, response) => {
    const id = request.params.id;

    if (!isValidObjectId(id)) {
        return response.status(400).json({
            "messsage": "Invalid id format."
        });
    }

    const findNoteAndDelete = Note.findByIdAndDelete(id).exec()
        .then(result => {
            if (result === null) {
                return response.status(404).json({
                    "messsage": "Resource not found."
                });
            }

            response.status(204).end();
        })
        .catch(error => {
            console.log(error);
            return response.status(500);
        });
})

app.use(unknownEndpoint);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`)
});