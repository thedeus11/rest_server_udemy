const moongose = require('mongoose');
var Schema = moongose.Schema;


let productoSchema = new Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre es necesario']
    },
    precioUni: {
        type: Number,
        require: [true, 'El precio únitario es necesario']
    },
    descripcion: {
        type: String,
        require: false
    },
    img: {
        type: String,
        require: false
    },
    disponible: {
        type: Boolean,
        require: true,
        default: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria'
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

module.exports = moongose.model('Producto', productoSchema);