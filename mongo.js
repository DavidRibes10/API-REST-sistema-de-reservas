const mongoose = require('mongoose')

const { MONGO_DB_URI, MONGO_DB_URI_DEV, NODE_ENV } = process.env
const connectionString = NODE_ENV === 'development'
  ? MONGO_DB_URI_DEV
  : MONGO_DB_URI

// conexión a mongodb
mongoose.connect(connectionString)
  .then(() => {
    console.log('Database connected')
  }).catch(err => {
    console.error(err)
  })

process.on('uncaughtException', () => {
  mongoose.connection.close()
  // mongoose.connection.disconnect() --> esta en teoría es la  buena, pero no funciona.
})
