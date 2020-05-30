const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

//verification google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });

    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async (req, res) => {
    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(err => {
            res.status(403).json({
                ok: false,
                err
            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        if (usuarioDB) {
            //Si existe el usuario y tiene el registro de google en false
            if (usuarioDB.google == false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticación normal'
                    }
                })

            } else {
                //si está registrado desde google
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN})

                return res.json({
                    ok:true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else {

            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = googleUser.google;
            usuario.password = ':)';


            usuario.save( (err, usuarioDB)=>{
                if (err) {
                    return res.status(500).json({
                        ok:false,
                        err
                    });
                }
                
                let token =  jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token 
                });
            });

        }
    });

})

module.exports = app;