module.exports = (request, response, next) => {
  response.status(404).send({ error: 'La ruta no se ha encontrdo' })
}
