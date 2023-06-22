const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.get('/', async (request, response, next) => {
  User.find({})
    .then(reservations => {
      response.json(reservations)
    }).catch(err => next(err))
})

usersRouter.post('/', async (request, response) => {
  const { body } = request
  const { username, password } = body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    passwordHash
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

module.exports = usersRouter