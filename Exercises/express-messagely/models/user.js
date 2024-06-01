/** User class for message.ly */
const db = require('../db');
const bcrypt = require('bcrypt');
const {BCRYPT_WORK_FACTOR} = require('../config');
const ExpressError = require('../expressError');

/** User of the site. */

class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({username, password, first_name, last_name, phone}) { 
    const join_at = new Date();
    const hashedPassword = await bcrypt.hash(password,BCRYPT_WORK_FACTOR);
    const new_user = await db.query(`INSERT INTO users (username,password,first_name,last_name,phone,join_at,last_login_at)
                                VALUES  ($1,$2,$3,$4,$5,$6,$7)
                                RETURNING username, password, first_name, last_name, phone`,
                              [username,hashedPassword,first_name,last_name,phone,join_at,join_at]
                              )    

    return new_user.rows[0];
  }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) { 
    const user = await db.query(`SELECT username, password FROM users
                            WHERE username =$1`,
                            [username])
    if(user.rows.length === 0 ||
       !(await bcrypt.compare(password,user.rows[0].password)))return false;

    return true;
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) { 
    const now = new Date();
    const results = await db.query(`UPDATE users SET last_login_at=$1
                                    WHERE username=$2`,
                                    [now,username])    
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() { 
    const results = await db.query(
      `SELECT username,
         first_name,
         last_name,
         phone
       FROM users
       ORDER BY last_name, first_name`
    );
    return results.rows;
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) { 
    const results = await db.query(
      `SELECT username, 
         first_name,
         last_name,
         phone,
         join_at, 
         last_login_at
       FROM users
       WHERE username=$1`,
       [username]
    );
    return results.rows[0];
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
    let results = await db.query(`SELECT id, body, sent_at, read_at, username, first_name, last_name, phone
                                    FROM messages
                                    LEFT JOIN users ON username = to_username
                                    WHERE from_username=$1`,
                                    [username])
    if(results.rows.length === 0){
      throw new ExpressError(`No messages were found from the user ${username}`,404);
    }

    results = results.rows.map(row=>{
      const {id, body, sent_at, read_at, username, first_name, last_name, phone} = row;
      return {id, body, sent_at, read_at,to_user:{username, first_name, last_name, phone}};
    })

    return results;
   }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) { 
    let results = await db.query(`SELECT id, body, sent_at, read_at, username, first_name, last_name, phone
                                    FROM messages
                                    LEFT JOIN users ON username = from_username
                                    WHERE to_username=$1`,
                                    [username])
    if(results.rows.length === 0){
      throw new ExpressError(`No messages were found for the user ${username}`,404);
    }

    results = results.rows.map(row=>{
      const {id, body, sent_at, read_at, username, first_name, last_name, phone} = row;
      return {id, body, sent_at, read_at,from_user:{username, first_name, last_name, phone}};
    })

    return results;
  }

}


module.exports = User;