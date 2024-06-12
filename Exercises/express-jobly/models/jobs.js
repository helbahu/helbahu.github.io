"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate, sqlJobsFilter } = require("../helpers/sql");


/** Related functions for jobs. */

class Job {
  /** Create a job (from data), update db, return new job data.
   *
   * data should be { title, salary, equity, company_handle }
   *
   * Returns { id, title, salary, equity, company_handle }
   * */

  static async create({ title, salary, equity, company_handle }) {
    const result = await db.query(
          `INSERT INTO jobs
           (title, salary, equity, company_handle)
           VALUES ($1, $2, $3, $4)
           RETURNING id, title, salary, equity, company_handle`,
        [
            title,
            salary,
            equity,
            company_handle
        ],
    );
    const job = result.rows[0];

    return job;
  }

  /** Find all jobs.
   *
   * Returns [{ id, title, salary, equity, company_handle }, ...]
   * */

  static async findAll(queries) {
    const sqlFilterStr = sqlJobsFilter(queries);
    const jobsRes = await db.query(
          `SELECT id,
                  title,
                  salary,
                  equity,
                  company_handle
           FROM jobs ${sqlFilterStr}
           ORDER BY title`);
    return jobsRes.rows;
  }

  /** Given a job id, return data about the job.
   *
   * Returns { id, title, salary, equity, company }
   *   where company is { handle, name, description, numEmployees, logoUrl }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(jpb_id) {
    const jobRes = await db.query(
          `SELECT j.id,
                  j.title,
                  j.salary,
                  j.equity,
                  c.handle, 
                  c.name, 
                  c.description, 
                  c.num_employees AS "numEmployees", 
                  c.logo_url AS "logoUrl"
           FROM jobs AS j
           LEFT JOIN companies AS c ON j.company_handle = c.handle
           WHERE j.id = $1`,
        [jpb_id]);

    if (!jobRes.rows[0]) throw new NotFoundError(`No job: ${jpb_id}`);

    const { id, title, salary, equity, handle, name, description, numEmployees, logoUrl} = jobRes.rows[0];
    const company = { handle, name, description, numEmployees, logoUrl};
    const job = { id, title, salary, equity, company};

    return job;
  }

  /** Update job data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: { title, salary, equity }
   *
   * Returns { id, title, salary, equity, company_handle}
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data,{});
    const handleVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE jobs 
                      SET ${setCols} 
                      WHERE id = ${handleVarIdx} 
                      RETURNING id, 
                                title, 
                                salary, 
                                equity, 
                                company_handle`;
    const result = await db.query(querySql, [...values, id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);

    return job;
  }

  /** Delete given job from database; returns undefined.
   *
   * Throws NotFoundError if job not found.
   **/

  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM jobs
           WHERE id = $1
           RETURNING id`,
        [id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);
  }

  /** POST add a tech skill to job. 
   * Returns undefined
  */
  static async addTechSkill(jobId,techId) {
    try{
      let result = await db.query(
        `INSERT INTO jobs_technologies (job_id, tech_id)
          VALUES ($1,$2)
          RETURNING job_id, tech_id`, 
          [jobId,techId]
      );
      if (!result.rows[0]) throw new NotFoundError(`No tech skill: ${techId}`);
    }catch (err){
      if(err.message.includes('duplicate')){
        throw new BadRequestError(`Duplicate skill for ${jobId}`);
      }else if(err.message.includes('violates foreign key constraint')){
        throw new NotFoundError(`No job with id ${jobId} and/or no tech skill with id ${techId}.`);
      }
    }
  }

  /** GET all job's tech skill. 
   * Returns [{techSkill}, ... ]
  */
  static async viewTechSkill(jobId) {
    try{
      let result = await db.query(
        `SELECT t.id, t.name FROM jobs AS j
          LEFT JOIN jobs_technologies AS jt ON j.id = jt.job_id
          LEFT JOIN technologies AS t ON t.id = jt.tech_id
          WHERE j.id =$1`, 
          [jobId]
      );
      if (!result.rows[0].id) return `No tech skills found for this job.`;
      return result.rows;

    }catch (err){
      throw new NotFoundError(`No job with id ${jobId}.`);
    }

  }


  /** GET all users that have any of the skills the job requires. 
   * RETURNING [{user}, ... ]
  */
  static async matchSkillsWithUsers (jobId) {
    let result = await db.query(
    `SELECT u.username, u.first_name AS "firstName", u.last_name AS "lastName", u.email, u.is_admin AS "isAdmin"
        FROM jobs AS j
        LEFT JOIN jobs_technologies AS jt
        ON j.id = jt.job_id
        LEFT JOIN users_technologies AS ut
        ON jt.tech_id = ut.tech_id
        LEFT JOIN users AS u
        ON ut.username = u.username
        WHERE j.id = $1
        GROUP BY u.username
        HAVING u.username is not NULL`,
    [jobId]
    );

    return result.rows;
      
  }

}


module.exports = Job;