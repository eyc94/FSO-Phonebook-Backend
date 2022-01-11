require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

app.use(express.static('build'));
app.use(express.json());
app.use(cors());

// Part 3-7.
// app.use(morgan('tiny'));

// Part 3-8.
morgan.token('payload', (req, res) => {
    return JSON.stringify(req.body)
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :payload'));

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons);
    });
});

app.get('/info', (request, response) => {
    Person.countDocuments()
        .then(result => {
            const message = `
                <p>Phonebook has info for ${result} people</p>
                <p>${new Date()}</p>
            `;
            response.send(message);
        });
});

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end();
        })
        .catch(error => next(error));
});

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({
            error: 'name is missing'
        });
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number is missing'
        });
    }

    // if (persons.filter(person => person.name.toLowerCase() === body.name.toLowerCase()).length > 0) {
    //     return response.status(400).json({
    //         error: 'name must be unique'
    //     });
    // }

    const newPerson = new Person({
        name: body.name,
        number: body.number
    });

    newPerson.save().then(savedPerson => {
        response.json(savedPerson);
    })
});

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body;

    const person = {
        name: body.name,
        number: body.number
    };

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson);
        })
        .catch(error => next(error));
});

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    }

    next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});