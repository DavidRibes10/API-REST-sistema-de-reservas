const reservationsRouter = require('express').Router()
const Reservation = require('../models/Reservation')

reservationsRouter.get('/', (request, response, next) => {
  Reservation.find({})
    .then(reservations => {
      response.json(reservations)
    }).catch(err => next(err))
})

reservationsRouter.get('/:user', (request, response, next) => {
  Reservation.find({ user: request.params.user })
    .then(reservations => {
      reservations.length > 0
        ? response.json(reservations)
        : response.status(204).json(reservations)
    }).catch(err => next(err))
})

module.exports = reservationsRouter
