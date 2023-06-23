require('dotenv').config()
// Realiza la conexión a la BD porque ejecuta el archivo mongo.js entero
require('./mongo')

const express = require('express')
const app = express()
const cors = require('cors')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')
const usersRouter = require('./controllers/users')
const reservationsRouter = require('./controllers/reservations')

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
  response.send('<h1>Bienvenido al sistema de reservas</h1>')
})

app.use('/api/users', usersRouter)
app.use('/api/reservations', reservationsRouter)

app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
