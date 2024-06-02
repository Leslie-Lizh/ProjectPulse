const debug = require("debug")("mern:controllers:usersController");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require('../../config/database');

const createJWT = (user) =>
    jwt.sign({ user }, process.env.SECRET, { expiresIn: "30m" });

async function show(req, res, next) {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT * FROM bands");
        debug(result.rows);
        res.json(result.rows)
    } catch(err) {
        debug(err);
        res.status(500).json({ msg: 'Database query failed' });
    } finally {
        if (client) client.release();
    }
}

module.exports = {
    show
}