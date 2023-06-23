const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.get('/', (request, response, next) => {
  User.find({})
    .then(reservations => {
      response.json(reservations)
    }).catch(err => next(err))
})

module.exports = usersRouter
