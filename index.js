const express = require('express')
const cors = require("cors")
const morgan = require('morgan')

const app = express()

morgan.token("postData", req => JSON.stringify(req.body))

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))

let persons =
    [
        {
          "id": 1,
          "name": "Arto Hellas",
          "number": "040-123456"
        },
        {
          "id": 2,
          "name": "Ada Lovelace",
          "number": "39-44-5323523"
        },
        {
          "id": 3,
          "name": "Dan Abramov",
          "number": "12-43-234345"
        },
        {
          "id": 4,
          "name": "Mary Poppendieck",
          "number": "39-23-6423122"
        }
    ]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get("/info", (req, res) => {
    const toSend =
        `
        <p>Phonebook has ${persons.length} peep(s)</p>
        <p>${new Date()}</p>
        `
    res.send(toSend)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

const randomIntOfMinMax =
    (min, max) =>
        Math.floor(Math.random() * (max - min + 1) + min)

const generateId =
    () =>
        randomIntOfMinMax(1, 999999999)

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (persons.find(p => p.name === body.name)) {
      return response.status(400).json({
          error: "name must be unique"
      })
  }

  const person = {
    name: body.name,
    number: body.number || "",
    id: generateId(),
  }

  persons = [ person, ...persons ]

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
