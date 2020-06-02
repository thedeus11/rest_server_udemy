const express = require('express');
const _ = require('underscore');
const Categoria = require('../models/categoria');
const { tokenVerification, adminRoleVerification } = require('../middlewares/autentication');

const app = express();

app.get('/categoria', tokenVerification, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriasDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Categoria.count((err, conteo) => {
                res.json({
                    ok: true,
                    categorias: categoriasDB,
                    cuantos: conteo
                });
            });

        });

});

app.get('/categoria/:id', tokenVerification, (req, res) => {

    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoriaDB
        });
    }).populate('usuario', 'nombre email');

});

app.post('/categoria', [tokenVerification, adminRoleVerification], (req, res) => {

    let body = req.body;
    let usuarioId = req.usuario._id;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id //obtengo el id del verifica token
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

app.put('/categoria/:id', [tokenVerification, adminRoleVerification], (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate(id, { descripcion: body.descripcion }, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

app.delete('/categoria/:id', [tokenVerification, adminRoleVerification], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria Borrada'
        });

    });
});

module.exports = app;