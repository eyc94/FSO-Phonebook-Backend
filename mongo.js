const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log(
        'Please provide the password as an argument: node mongo.js <password> or node mongo.js <password> <name> <number>'
    );
    process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://first-user:${password}@cluster0.yv4do.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person);
        });
        mongoose.connection.close();
    });
} else if (process.argv.length < 6) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    });

    person.save().then(result => {
        console.log('person saved!');
        mongoose.connection.close();
    });
}

// Need conditional statement to handle empty name and number.
// const name = process.argv[3];
// const number = process.argv[4];
