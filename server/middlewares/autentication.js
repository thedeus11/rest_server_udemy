const jwt = require('jsonwebtoken');

// ============================
//  Token verification
// ============================
let tokenVerification = (req, res, next) => {

    let token = req.get('Authorization') //Get Header Token

    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decode.usuario;
        next();
    });
}

// ============================
//  verify administrator role
// ============================

let adminRoleVerification = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(500).json({
            ok: false,
            err: {
                message: 'The user role is not administrator'
            }
        });
    }
    
}

// =====================
// Verifica token para imagen
// =====================
let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
}

module.exports = {
    tokenVerification,
    adminRoleVerification,
    verificaTokenImg
}