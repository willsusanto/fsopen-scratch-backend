require('dotenv').config();

const express = require ('express');
const cors = require('cors');
const Note = require('./models/note');
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

const getNewId = () => {
    const newId = notes.length > 0 
        ? Math.max(...notes.map(note => Number(note.id))) + 1
        : 1;

    return String(newId);
}

app.get("/", (request, response) => {
    console.log(request);
    response.status(200).send("<h1>Hello world, this is the default route!</h1>");
})

app.get("/api/notes/:id", (request, response) => {
    const id = request.params.id;
    const findNote = notes.find(note => note.id === id);

    if (findNote === undefined) {
        // response.statusMessage = "Testing bro";
        return response.status(404).json({
            "messsage": "Resource not found."
        });
    }

    // Content-Type header auto-set for .json() to application/json
    response.json(findNote);
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

    const newNote = {
        id: getNewId(),
        content: note.content,
        important: Boolean(note.important) ?? false
    };

    notes = [...notes, newNote];

    response.status(201).json(newNote);
})

app.delete("/api/notes/:id", (request, response) => {
    const id = request.params.id;
    notes = notes.filter(note => note.id !== id);

    response.status(204).end();
})

app.use(unknownEndpoint);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`)
});