const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String, unique: true, require: [true, 'Descripción necesaria']
    },
    usuario: {
        type: Schema.Types.ObjectId, ref: 'Usuario'
    }
});

module.exports = mongoose.model('Categoria', categoriaSchema)