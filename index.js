require('dotenv').config();

const express = require ('express');
const cors = require('cors');
const { Note, isValidObjectId } = require('./models/note');
const app = express();

app.use(express.static("dist"));
app.use(express.json())

const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

const requestLogger = (request, response, next) => {
    console.log("Method :",request.method);
    console.log("Body :", request.body);
    console.log("Path :", request.path);
    console.log("Time :", Date());

    next();
}
app.use(requestLogger);

app.get("/", (request, response) => {
    console.log(request);
    response.status(200).send("<h1>Hello world, this is the default route!</h1>");
})

app.get("/api/notes/:id", (request, response, next) => {
    const id = request.params.id;

    // if (!isValidObjectId(id)) {
    //     return response.status(400).json({
    //         "messsage": "Invalid id format."
    //     });
    // }

    const findNote = Note.findById(id).exec()
        .then(result => {
            if (result === null) {
                return response.status(404).json({
                    "messsage": "Resource not found."
                });
            }

            response.json(result);
        })
        .catch(error => next(error));
});

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

app.put("/api/notes/:id", (request, response, next) => {
    const id = request.params.id;
    const body = request.body;

    const updatedNote = {
        content: body.content,
        important: body.important
    };

    Note.findByIdAndUpdate(id, updatedNote, { new: true }).exec()
        .then(result => {
            response.json(result);
        })
        .catch(error => next(error));
})

app.delete("/api/notes/:id", (request, response, next) => {
    const id = request.params.id;

    const findNoteAndDelete = Note.findByIdAndDelete(id).exec()
        .then(result => {
            if (result === null) {
                return response.status(404).json({
                    "messsage": "Resource not found."
                });
            }

            response.status(204).end();
        })
        .catch(error => next(error));
})

const unknownEndpoint = (request, response, next) => {
    response.status(404).send({ error: "Unknown endpoint." });
    next();
}
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.error("ERROR: ", error.message);

    if (error.name === "CastError") {
        return response.status(400).json({
            message: "Invalid id format."
        });
    }

    next(error);
}
app.use(errorHandler);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`)
});