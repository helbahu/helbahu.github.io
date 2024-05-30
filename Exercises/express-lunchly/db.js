/** Database for lunchly */

const pg = require("pg");
require('dotenv').config()

const db = new pg.Client({
    connectionString: `postgresql://${process.env.USER}:${process.env.DBPASSWORD}@localhost/lunchly`
})

db.connect();

module.exports = db;
