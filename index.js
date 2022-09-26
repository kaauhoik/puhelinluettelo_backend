const { json, request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const rl = require("./middlewares")

const app = express()
app.use(express.json())
//app.use(rl.requestLogger)
//app.use(rl.unknownEndpoint)
morgan.token('body', function (req) {
    if (req.method === "POST"){
        return JSON.stringify(req.body)
    }
    return ""
  })

app.use(morgan(':method :url :status: :res[content-length] - :response-time ms :body'))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-53235323"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-23456"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-46489123"
    }

]

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

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.post('/api/persons',(req, res) => {
    const body = req.body
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'content missing'
        })
    }
    
    if (persons.find(p => p.name === body.name))
    {
        return res.status(409).json({
            error: 'name must be unique'
        })
    }
    const person = {
        id : GetMaxId(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    res.json(person)

})

app.get('/api/info', (request, response) => {
    console.log(Date.now())
    response.send(
    `<div>
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    </div>`)
})

const GetMaxId = () => {
    const maxID = persons.length > 0 ? 
    Math.max(... persons.map(n => n.id)) : 0

    return maxID +1
}

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})