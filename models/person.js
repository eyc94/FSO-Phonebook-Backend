const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connecting to MongoDB', error.message);
    });

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

module.exports = mongoose.model('Person', personSchema);

// if (process.argv.length === 3) {
//     console.log('Phonebook:');
//     Person.find({}).then(result => {
//         result.forEach(person => {
//             console.log(person.name, person.number);
//         });
//         mongoose.connection.close();
//     });
// } else if (process.argv.length < 6) {
//     const person = new Person({
//         name: process.argv[3],
//         number: process.argv[4],
//     });

//     person.save().then(result => {
//         console.log('person saved!');
//         mongoose.connection.close();
//     });
// }