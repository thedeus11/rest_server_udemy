const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const Usuario = require('../models/usuario');

const app = express();

app.post('/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    Usuario.findOne({ email: body.email }, (err, UsuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!UsuarioDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: '(Usuario) o Contraseña incorrecta'
                }
            });
        }
        if (!bcrypt.compareSync(body.password, UsuarioDB.password)) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Usuario o (Contraseña) incorrecta'
                }
            })
        }
        let token = jwt.sign({
            usuario: UsuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
        res.json({
            ok: true,
            usuario: UsuarioDB,
            token
        });
    });
});

module.exports = app;