const express = require('express');
const _ = require('underscore');
const Producto = require('../models/producto.js');
const { tokenVerification, adminRoleVerification } = require('../middlewares/autentication');
const categoria = require('../models/categoria.js');

const app = express();

app.get("/productos", tokenVerification, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({})
        .sort('nombre')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.count((err, conteo) => {
                res.json({
                    ok: true,
                    producto: productoDB,
                    cuantos: conteo
                });
            });
        });
});

app.get("/productos/:id", tokenVerification, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB,
            });

        });
});


app.get("/productos/busqueda/:termino", (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        });
});

app.post("/productos", [tokenVerification, adminRoleVerification], (req, res) => {
    let body = req.body;
    let usuarioId = req.usuario._id;

    let producto = new Producto({
        usuario: usuarioId,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    })
});

app.put("/productos/:id", [tokenVerification, adminRoleVerification], (req, res) => {

    let id = req.params.id;
    let body = req.body;

    producto = {
        nombre: req.body.nombre,
        precioUni: req.body.descripcion,
        descripcion: req.body.descripcion,
        categoria: req.body.categoria
    }

    Producto.findByIdAndUpdate(id, producto, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

app.delete("/productos/:id", [tokenVerification, adminRoleVerification], (req, res) => {

    let id = req.params.id;
    Producto.findByIdAndUpdate(id, { disponible: false }, (err, productoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Producto Borrado'
        });

    });
});

module.exports = app;