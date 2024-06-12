"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
  /** authenticate user with username, password.
   *
   * Returns { username, first_name, last_name, email, is_admin }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
          `SELECT username,
                  password,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  is_admin AS "isAdmin"
           FROM users
           WHERE username = $1`,
        [username],
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register(
      { username, password, firstName, lastName, email, isAdmin }) {
    const duplicateCheck = await db.query(
          `SELECT username
           FROM users
           WHERE username = $1`,
        [username],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
          `INSERT INTO users
           (username,
            password,
            first_name,
            last_name,
            email,
            is_admin)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"`,
        [
          username,
          hashedPassword,
          firstName,
          lastName,
          email,
          isAdmin,
        ],
    );

    const user = result.rows[0];

    return user;
  }

  /** Find all users.
   *
   * Returns [{ username, first_name, last_name, email, is_admin }, ...]
   **/

  static async findAll() {
    const result = await db.query(
          `SELECT username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  is_admin AS "isAdmin"
           FROM users
           ORDER BY username`,
    );

    return result.rows;
  }

  /** Given a username, return data about user.
   *
   * Returns { username, first_name, last_name, is_admin, jobs }
   *   where jobs is [ jobId, ... ]
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(username) {
    const userRes = await db.query(
          `SELECT u.username,
                  u.first_name AS "firstName",
                  u.last_name AS "lastName",
                  u.email,
                  u.is_admin AS "isAdmin",
                  json_agg(j.id) AS "jobs"
           FROM users AS u
           LEFT JOIN applications AS a ON u.username = a.username
           LEFT JOIN jobs AS j ON j.id = a.job_id 
           WHERE u.username = $1
           GROUP BY u.username`,
        [username],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
    if(!user.jobs[0])user.jobs = [];
    
    return user;
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, password, email, isAdmin }
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password or make a user an admin.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risks are opened.
   */

  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          firstName: "first_name",
          lastName: "last_name",
          isAdmin: "is_admin",
        });
    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                email,
                                is_admin AS "isAdmin"`;
    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    delete user.password;
    return user;
  }

  /** Delete given user from database; returns undefined. */

  static async remove(username) {
    let result = await db.query(
          `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
        [username],
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }

  /** POST add a new application for a job for the given username and job_id. 
   * Returns undefined
  */
  static async apply(username,job_id) {
    try{
      let result = await db.query(
        `INSERT INTO applications (username,job_id,state)
          VALUES ($1,$2,'applied')`,
          [username,job_id]
      );
      
    }catch (err){
      if(err.message.includes('duplicate')){
        throw new BadRequestError(`An application already exists for ${username} and for the job with id ${job_id}.`);
      }else if(err.message.includes('violates foreign key constraint')){
        throw new NotFoundError(`No user with username ${username} and/or no job with id ${job_id}.`);
      }
    }

  }

  /** POST add a tech skill to user. 
   * Returns undefined
  */
  static async addTechSkill(username,techId) {
    try{
      let result = await db.query(
        `INSERT INTO users_technologies (username, tech_id)
          VALUES ($1,$2)
          RETURNING username, tech_id`, 
          [username,techId]
      );
      if (!result.rows[0]) throw new NotFoundError(`No tech skill: ${techId}`);
    }catch (err){
      if(err.message.includes('duplicate')){
        throw new BadRequestError(`Duplicate skill for ${username}`);
      }else if(err.message.includes('violates foreign key constraint')){
        throw new NotFoundError(`No user with username ${username} and/or no tech skill with id ${techId}.`);
      }
    }

  }

  /** GET all user's tech skill. 
   * Returns [{techSkill}, ... ]
  */
  static async viewTechSkill(username) {
    try{
      let result = await db.query(
        `SELECT t.id, t.name FROM users AS u
          LEFT JOIN users_technologies AS ut ON u.username = ut.username
          LEFT JOIN technologies AS t ON t.id = ut.tech_id
          WHERE u.username =$1`, 
          [username]
      );
      if (!result.rows[0].id) return `No tech skills found for ${username}.`;
      return result.rows;

    }catch (err){
      throw new NotFoundError(`No user with username ${username}.`);
    }

  }

  /** GET all jobs that require any of the skills the user has. 
   * RETURNING [{job}, ... ]
  */
  static async matchSkillsWithJobs (username) {
    let result = await db.query(
      `SELECT j.id, j.title, j.salary, j.equity, j.company_handle
        FROM users AS u
        LEFT JOIN users_technologies AS ut
          ON u.username = ut.username
        LEFT JOIN jobs_technologies AS jt
          ON ut.tech_id = jt.tech_id
        LEFT JOIN jobs AS j
          ON jt.job_id = j.id
        WHERE u.username = $1
        GROUP BY j.id
        HAVING j.id is not NULL`,
      [username]
    );

    return result.rows;
      
  }



}


module.exports = User;
