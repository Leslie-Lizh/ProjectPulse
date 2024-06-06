const debug = require("debug")("pern:controllers:usersController");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require('../../config/database');

const SALT_ROUNDS = 6;

const createJWT = (user) =>
    jwt.sign({ user }, process.env.SECRET, { expiresIn: "30m" });

async function show(req, res) {
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

async function createUser(req, res) {
    const { name, dept, role, email, password, is_admin } = req.body;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const client = await pool.connect();
    try {
        const queryText = 'INSERT INTO users (name, dept, role, email, password, is_admin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
        const result = await client.query(queryText, [name, dept, role, email, hashedPassword, is_admin]);
        const user = result.rows[0];
        delete user.password; // remove password before jwt
        const token = createJWT(user);
        res.status(201).json(token);
    } catch (err) {
        debug(err);
        res.status(500).json({msg: "Failed to create user"})
    } finally {
        if (client) client.release();
    }
}

async function login(req, res) {
    const { email, password } = req.body;
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (user === null) {
            res.status(401).json({ msg: "User not found" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            delete user.password; // remove password before jwt
            const token = createJWT(user);
            res.json(token);
        } else {
            res.status(401).json({ msg: "Password incorrect" });
        }
    } catch (err) {
        debug(err);
        res.status(500).json({msg: "Failed to retrieve user info"})
    } finally {
        if (client) client.release();
    }
}

module.exports = {
    show,
    createUser,
    login,
}