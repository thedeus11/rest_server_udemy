// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;

// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
//  Caducidad token
// ============================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
// ============================
//  SEED
// ============================

process.env.SEED = process.env.SEED || 'security-local';

// ============================
//  Base de datos
// ============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

// ============================
//  Google Client ID
// ============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '106823288642-ppdlfp857sbojcd89ki041q0ockfi6oi.apps.googleusercontent.com'
