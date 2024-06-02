// connection for mongodb
// const mongoose = require("mongoose");
const debug = require("debug")("mern:config:database");

// mongoose.set("debug", true);
// mongoose.connect(process.env.DATABASE_URL);

// const db = mongoose.connection;

// db.on("connected", function () {
//   debug(`Connected to ${db.name} at ${db.host}:${db.port}`);
// });
  
// db.on("error", (err) => {
//   debug(`Database connection error: ${err}`);
// });
    
// db.on("disconnected", () => {
//   debug("Mongoose disconnected");
// });

// connection for postgres
const pg = require("pg");
const { Pool } = pg;
const connectionString = process.env.POSTGRES_URL;

const pool = new Pool({
  connectionString,
})

pool.on('connect', () => {
  debug(`Connected to ${pool._clients[0]?.database} at ${pool._clients[0]?.host}:${pool._clients[0]?.port}`);
});

pool.on('error', (err) => {
  debug(`Database connection error: ${err}`);
  process.exit(-1);
});

module.exports = pool;