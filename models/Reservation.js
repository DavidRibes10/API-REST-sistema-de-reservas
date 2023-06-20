const { Schema, model } = require('mongoose')

const reservationSchema = new Schema({
  numeroSocio: Number,
  dia: Date,
  hora: Number,
  fechaOperacion: Date
})

// mapea los datos que llegan desde ls BD para que no aparezcan _id y __v y nos deje el campo ID como lo necesitamos.
// Modifica el comportamiento del toJSON que hace por defecto el reservationSchema al traer los datos
reservationSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Reservation = model('Reservation', reservationSchema)

module.exports = Reservation
