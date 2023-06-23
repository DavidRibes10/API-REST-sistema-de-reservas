const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/User')

const { SALT_ROUNDS } = process.env

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
  const { username, password, correo } = body

  if (!username) {
    return response.status(400).json({
      error: "required 'username' is missing"
    })
  }

  if (!password) {
    return response.status(400).json({
      error: "required 'password' is missing"
    })
  }

  if (!correo) {
    return response.status(400).json({
      error: "required 'correo' is missing"
    })
  }

  const passwordHash = await bcrypt.hash(password, Number(SALT_ROUNDS))

  const user = new User({
    username,
    passwordHash
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

userRouter.put('/:id', async (request, response, next) => {
  const { id } = request.params
  const { body } = request
  const { username, password, correo } = body

  if (!username) {
    return response.status(400).json({
      error: "required 'username' is missing"
    })
  }
  if (!password) {
    return response.status(400).json({
      error: "required 'password' is missing"
    })
  }

  if (!correo) {
    return response.status(400).json({
      error: "required 'correo' is missing"
    })
  }

  const passwordHash = await bcrypt.hash(password, Number(SALT_ROUNDS))

  const newUserInfo = {
    username,
    correo,
    passwordHash
  }
  // con el new hacemos que devuelva la nota nueva. Si se deja vacio devuelve la vieja
  User.findByIdAndUpdate(id, newUserInfo, { new: true })
    .then((result) => {
      result
        ? response.status(201).json(result)
        : response.status(404).json({
          error: 'No se ha modificado porque no se ha encontrado el usuario.'
        })
    }).catch(err => next(err))
})

module.exports = userRouter
