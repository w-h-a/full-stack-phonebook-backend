const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.ugrx6.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url)

const phonebookSchema =
    new mongoose.Schema({
        name: String,
        number: Number,
    })

const Person = mongoose.model("Person", phonebookSchema)

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        result.forEach(per => {
            console.log(per.name, per.number)
        })
        mongoose.connection.close()
    })
} else {
    const person =
        new Person({
            name: process.argv[3],
            number: process.argv[4] || 0,
        })
    person.save().then(result => {
        console.log('saved!')
        mongoose.connection.close()
    })
}
