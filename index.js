
require('dotenv').config()
//Realiza la conexión a la BD porque ejecuta el archivo mongo.js entero
require('./mongo')

const express = require("express")
const app = express()
const cors = require("cors")
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')
const Reservation = require('./models/Reservation')

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
    response.send('<h1>Bienvenido al sistema de reservas</h1>')
})

app.get('/api/reservations', (request, response, next) => {
    Reservation.find({})
    .then(reservations => {
        response.json(reservations)
    }).catch(err => next(err))
})

app.get('/api/reservations/:id', (request, response, next) => {
    const { id } = request.params
    
    Reservation.findById(id).then(reservation => {
        if(reservation){
            response.json(reservation)
        } else {
            response.status(404).end()
        }
    }).catch(err => next(err))
})

app.get('/api/member/:id', (request, response, next) => {
    const { numeroSocio } = request.params
    
    Reservation.find({numeroSocio: this.numeroSocio}).then(reservation => {
        if(reservation){
            response.json(reservation)
        } else {
            response.status(404).end()
        }
    }).catch(err => next(err))
})

app.delete('/api/reservations/:id', (request, response, next) => {
    const { id } = request.params
    Reservation.findByIdAndDelete(id).then(() => {
        response.status(204).end()
    }).catch(error => next(error))})

app.post('/api/reservations', (request, response, next) => {
    const reservation = request.body

    if(!reservation.numeroSocio){
        return response.status(400).json({
            error: "required 'numeroSocio' is missing"
        })
    }
    if(!reservation.dia){
        return response.status(400).json({
            error: "required 'dia' is missing"
        })
    }
    if(!reservation.hora){
        return response.status(400).json({
            error: "required 'hora' is missing"
        })
    }

    const newReservation = new Reservation({
        numeroSocio: reservation.numeroSocio,
        dia: reservation.dia,
        hora: reservation.hora,
        activa: true
    })

    newReservation.save().then(savedReservation => {
        response.json(savedReservation)
    }).catch(err => next(err))
})

app.put('/api/reservations/:id', (request, response, next) => {
    const { id } = request.params
    const  reservation  = request.body

    const newReservationInfo = {
        numeroSocio: reservation.numeroSocio,
        dia: reservation.dia,
        hora: reservation.hora,
        activa: reservation.activa
    }
    //con el new hacemos que devuelva la nota nueva. Si se deja vacio devuelve la vieja
    Reservation.findByIdAndUpdate(id, newReservationInfo, { new: true})
        .then(result => {
            response.json(result)
        }).catch(err => next(err))
})

app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})