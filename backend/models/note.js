const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const noteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: { type: [String], default: [] },
  isPinned: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Usar ObjectId y referencia si corresponde
  createdOn: { type: Date, default: Date.now }, // Usa Date.now para obtener la fecha actual
});

// Exportar el modelo de Mongoose
module.exports = mongoose.model('Note', noteSchema);
