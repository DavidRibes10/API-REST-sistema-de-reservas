const reservationRouter = require('express').Router()
const Reservation = require('../models/Reservation')

reservationRouter.get('/:id', (request, response, next) => {
  const { id } = request.params

  Reservation.findById(id).then(reservation => {
    if (reservation) {
      response.json(reservation)
    } else {
      response.status(204).json({
        error: 'No se ha encontrado la reserva.'
      })
    }
  }).catch(err => next(err))
})

reservationRouter.put('/:id', (request, response, next) => {
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
  Reservation.findByIdAndUpdate(id, newReservationInfo, { new: true })
    .then((result) => {
      result
        ? response.status(201).json(result)
        : response.status(404).json({
          error: 'No se ha modificado porque no se ha encontrado la reserva.'
        })
    }).catch(err => next(err))
})

reservationRouter.delete('/:id', (request, response, next) => {
  const { id } = request.params
  Reservation.findByIdAndDelete(id).then((deleted) => {
    deleted
      ? response.status(204).end()
      : response.status(404).json({
        error: 'No se ha podido borrar la reserva porque no se ha encontrado.'
      })
  }).catch(error => next(error))
})

reservationRouter.post('/', (request, response, next) => {
  const reservation = request.body

  if (!reservation.user) {
    return response.status(400).json({
      error: "required 'user' is missing"
    })
  }
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

  const newReservation = new Reservation({
    user: reservation.user,
    dia: reservation.dia,
    hora: reservation.hora,
    fechaOperacion: Date.now()
  })

  newReservation.save().then(savedReservation => {
    response.json(savedReservation)
  }).catch(err => next(err))
})

module.exports = reservationRouter
