require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

app.use(express.json());
app.use(express.static('build'));
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
    Person.findById(request.params.id).then(person => {
        response.json(person);
    });
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);
    response.status(204).end();
});

// const generateId = () => {
//     return Math.floor(Math.random() * 9999999);
// };

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

    persons = persons.concat(newPerson);

    response.json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});