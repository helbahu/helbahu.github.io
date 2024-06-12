"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate, sqlJobsFilter } = require("../helpers/sql");

class TechSkill {

    
  /** Create a tech-skill.
   *
   * data should be { name }
   *
   * Returns { id, name }
   * */
  static async create({ name }) {
    if(!name) throw BadRequestError("Require a name field for Tech Skill.")
    const result = await db.query(
          `INSERT INTO technologies (name)
           VALUES ($1)
           RETURNING id, name`,
        [name]);
    const skill = result.rows[0];

    return skill;
  }


  /** GET tech-skills list.
   *
   * Returns [{ id, name }, ...]
   * */
  static async getAll() {
    const result = await db.query(
          `SELECT id, name
           FROM technologies
           ORDER BY name`);
    return result.rows;
  }


  /** Delete given skill from database; returns undefined.
   *
   * Throws NotFoundError if skill not found.
   **/

  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM technologies
           WHERE id = $1
           RETURNING id`,
        [id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No tech skill with id: ${id}`);
  }
    
}

module.exports = TechSkill;