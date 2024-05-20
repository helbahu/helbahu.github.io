/** Database setup for BizTime. */
const { Client } = require('pg');
require('dotenv').config()

let DB_URI = process.env.NODE_ENV === 'test'
            ? "biztime_test"
            : "biztime";

let db = new Client({
    connectionString: `postgresql://${process.env.USER}:${process.env.DBPASSWORD}@localhost/${DB_URI}`
})

db.connect();

module.exports = db;