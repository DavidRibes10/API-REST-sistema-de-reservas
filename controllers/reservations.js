const reservationsRouter = require('express').Router()
const Reservation = require('../models/Reservation')
const User = require('../models/User')
const userExtractor = require('../middleware/userExtractor')

reservationsRouter.get('/', (request, response, next) => {
  Reservation.find({}).populate('user', {
    username: 1,
    correo: 1
  })
    .then(reservations => {
      response.json(reservations)
    }).catch(err => next(err))
})

reservationsRouter.get('/:id', (request, response, next) => {
  const { id } = request.params

  Reservation.findById(id).populate('user', {
    username: 1,
    correo: 1
  }).then(reservation => {
    if (reservation) {
      response.json(reservation)
    } else {
      response.status(204).json({
        error: 'No se ha encontrado la reserva.'
      })
    }
  }).catch(err => next(err))
})

reservationsRouter.get('/user/:id', (request, response, next) => {
  Reservation.find({ user: request.params.id }).populate('user', {
    username: 1,
    correo: 1
  })
    .then(reservations => {
      reservations.length > 0
        ? response.json(reservations)
        : response.status(204).json(reservations)
    }).catch(err => next(err))
})

reservationsRouter.post('/', userExtractor, async (request, response, next) => {
  const {
    dia,
    hora
  } = request.body

  const { user } = request

  if (!user) {
    return response.status(400).json({
      error: "required 'user' is missing"
    })
  }
  if (!dia) {
    return response.status(400).json({
      error: "required 'dia' is missing"
    })
  }
  if (!hora) {
    return response.status(400).json({
      error: "required 'hora' is missing"
    })
  }

  const reservationToUser = await User.findById(user)

  const newReservation = new Reservation({
    user: reservationToUser._id,
    dia,
    hora,
    fechaOperacion: Date.now()
  })

  newReservation.save().then(savedReservation => {
    reservationToUser.reservas = reservationToUser.reservas.concat(savedReservation._id)
    reservationToUser.save().then(response.json(savedReservation))
  }).catch(err => next(err))
})

reservationsRouter.put('/:id', userExtractor, (request, response, next) => {
  const { id } = request.params
  const reservation = request.body

  if (!reservation.dia) {
    return response.status(400).json({
      error: "required 'dia' is missing"
    })
  }
  if (!reservation.hora) {
    return response.status(400).json({
      error: "required 'hora' is missing"
    })
  }

  const newReservationInfo = {
    numeroSocio: reservation.numeroSocio,
    dia: reservation.dia,
    hora: reservation.hora,
    fechaOperacion: Date.now()
  }
  // con el new hacemos que devuelva la nota nueva. Si se deja vacio devuelve la vieja
  Reservation.findByIdAndUpdate(id, newReservationInfo, { new: true }).populate('user', {
    username: 1,
    correo: 1
  })
    .then((result) => {
      result
        ? response.status(201).json(result)
        : response.status(404).json({
          error: 'No se ha modificado porque no se ha encontrado la reserva.'
        })
    }).catch(err => next(err))
})

reservationsRouter.delete('/:id', userExtractor, (request, response, next) => {
  const { id } = request.params
  Reservation.findByIdAndDelete(id).then((deleted) => {
    deleted
      ? response.status(204).end()
      : response.status(404).json({
        error: 'No se ha podido borrar la reserva porque no se ha encontrado.'
      })
  }).catch(error => next(error))
})

module.exports = reservationsRouter
