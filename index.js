if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const cors = require("cors")
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

morgan.token("postData", req => JSON.stringify(req.body))

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get("/info", (req, res) => {
    Person
        .find({})
        .then(persons => {
            const toSend =
            `
            <p>Phonebook has ${persons.length} peep(s)</p>
            <p>${new Date()}</p>
            `
            res.send(toSend)
        })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get("/api/persons/:id", (req, res, nxt) => {
    Person
        .findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(err => nxt(err))
})

app.delete("/api/persons/:id", (req, res, nxt) => {
    Person
        .findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(err => nxt(err))
})

app.put("/api/persons/:id", (req, res, nxt) => {
    const { body } = req

    const person =
        {
            name: body.name,
            number: body.number,
        }

    Person
        .findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updated => {
            res.json(updated)
        })
        .catch(err => nxt(err))
})

app.post('/api/persons', (req, res, nxt) => {
    const { body } = req

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person
        .save()
        .then(savedPerson => savedPerson.toJSON())
        .then(savedAndFormattedPerson => res.json(savedAndFormattedPerson))
        .catch(err => nxt(err))
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
