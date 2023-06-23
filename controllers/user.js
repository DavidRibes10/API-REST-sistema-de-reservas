const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/User')

userRouter.get('/:id', (request, response, next) => {
  const { id } = request.params
  User.findById(id).then(user => {
    if (user) {
      response.json(user)
    } else {
      response.status(204).json({
        error: 'No se ha encontrado el usuario'
      })
    }
  }).catch(err => next(err))
})

userRouter.post('/', async (request, response) => {
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

module.exports = userRouter
