const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll() {
  await db.query("DELETE FROM users_technologies");
  await db.query("DELETE FROM jobs_technologies");
  await db.query("DELETE FROM technologies");

  await db.query("DELETE FROM applications");
  await db.query("DELETE FROM jobs");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM companies");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");

  await db.query(`
    INSERT INTO companies(handle, name, num_employees, description, logo_url)
    VALUES ('c1', 'C1', 1, 'Desc1', 'http://c1.img'),
           ('c2', 'C2', 2, 'Desc2', 'http://c2.img'),
           ('c3', 'C3', 3, 'Desc3', 'http://c3.img')`);

  await db.query(`
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email)
        VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com'),
               ('u2', $2, 'U2F', 'U2L', 'u2@email.com')
        RETURNING username`,
      [
        await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
      ]);

  await db.query(`
    INSERT INTO jobs(id, title, salary, equity, company_handle)
    VALUES (1, 'J1', 80000, 1.0, 'c1'),
           (2, 'J2', 70000, 0.8, 'c2'),
           (3, 'J3', 100000, 0.5, 'c3'),
           (4, 'J4', 75000, 0.1, 'c1')`);

  await db.query(`
    INSERT INTO applications (username,job_id,state)
    VALUES ('u1',3,'applied')`);

  await db.query(`
    INSERT INTO technologies (id,name)
    VALUES (1,'Python'), (2,'Javascript'), (3,'SQL')`);
    
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};