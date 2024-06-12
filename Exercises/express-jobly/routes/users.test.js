"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
} = require("./_testCommon");

const registerAdminUser = async () => {
  const {username,isAdmin} = await User.register({
    username: "u4",
    firstName: "U4F",
    lastName: "U4L",
    email: "user4@user.com",
    password: "password4",
    isAdmin: true
  });
  return createToken({username,isAdmin});
}

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /users */

describe("POST /users", function () {
  test("works for admins: create non-admin", async function () {
    const adminToken = await registerAdminUser();
    const resp = await request(app)
        .post("/users")
        .send({
          username: "u-new",
          firstName: "First-new",
          lastName: "Last-newL",
          email: "new@email.com",
          isAdmin: false,
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      user: {
        username: "u-new",
        firstName: "First-new",
        lastName: "Last-newL",
        email: "new@email.com",
        isAdmin: false,
      }, token: expect.any(String),
    });
  });

  test("works for admins: create admin", async function () {
    const adminToken = await registerAdminUser();
    const resp = await request(app)
        .post("/users")
        .send({
          username: "u-new",
          firstName: "First-new",
          lastName: "Last-newL",
          email: "new@email.com",
          isAdmin: true,
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      user: {
        username: "u-new",
        firstName: "First-new",
        lastName: "Last-newL",
        email: "new@email.com",
        isAdmin: true,
      }, token: expect.any(String),
    });
  });

  test("Unauthorized for non-admin users.", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "u-new",
          firstName: "First-new",
          lastName: "Last-newL",
          email: "new@email.com",
          isAdmin: false,
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });


  test("unauth for anon", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "u-new",
          firstName: "First-new",
          lastName: "Last-newL",
          email: "new@email.com",
          isAdmin: true,
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if missing data", async function () {
    const adminToken = await registerAdminUser();
    const resp = await request(app)
        .post("/users")
        .send({
          username: "u-new",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request if invalid data", async function () {
    const adminToken = await registerAdminUser();
    const resp = await request(app)
        .post("/users")
        .send({
          username: "u-new",
          firstName: "First-new",
          lastName: "Last-newL",
          email: "not-an-email",
          isAdmin: true,
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /users */

describe("GET /users", function () {
  test("works for admins", async function () {
    const adminToken = await registerAdminUser();
    const resp = await request(app)
        .get("/users")
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      users: [
        {
          username: "u1",
          firstName: "U1F",
          lastName: "U1L",
          email: "user1@user.com",
          isAdmin: false,
        },
        {
          username: "u2",
          firstName: "U2F",
          lastName: "U2L",
          email: "user2@user.com",
          isAdmin: false,
        },
        {
          username: "u3",
          firstName: "U3F",
          lastName: "U3L",
          email: "user3@user.com",
          isAdmin: false,
        },
        {
          username: "u4",
          firstName: "U4F",
          lastName: "U4L",
          email: "user4@user.com",
          isAdmin: true      
        },
      ],
    });
  });

  test("Unauthorized for non-admin users", async function () {
    const resp = await request(app)
        .get("/users")
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.status).toBe(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .get("/users");
    expect(resp.statusCode).toEqual(401);
  });

  test("fails: test next() handler", async function () {
    const adminToken = await registerAdminUser();
    // there's no normal failure event which will cause this route to fail ---
    // thus making it hard to test that the error-handler works with it. This
    // should cause an error, all right :)
    await db.query("DROP TABLE users CASCADE");
    const resp = await request(app)
        .get("/users")
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(500);
  });
});

/************************************** GET /users/:username */

describe("GET /users/:username", function () {
  test("works for admin", async function () {
    const adminToken = await registerAdminUser();
    const resp = await request(app)
        .get(`/users/u1`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      user: {
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "user1@user.com",
        isAdmin: false,
        jobs: [3]
      },
    });
  });

  test("works for non-admin who is the correct user.", async function () {
    const resp = await request(app)
        .get(`/users/u1`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      user: {
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "user1@user.com",
        isAdmin: false,
        jobs: [3]
      },
    });
  });

  test("unauth for non-admin who are not the correct user.", async function () {
    const resp = await request(app)
        .get(`/users/u2`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.status).toBe(401);
  });
  
  test("unauth for anon", async function () {
    const resp = await request(app)
        .get(`/users/u1`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if user not found", async function () {
    const adminToken = await registerAdminUser();
    const resp = await request(app)
        .get(`/users/nope`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** PATCH /users/:username */

describe("PATCH /users/:username", () => {
  test("works for admin", async function () {
    const adminToken = await registerAdminUser();
    const resp = await request(app)
        .patch(`/users/u1`)
        .send({
          firstName: "New",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      user: {
        username: "u1",
        firstName: "New",
        lastName: "U1L",
        email: "user1@user.com",
        isAdmin: false,
      },
    });
  });

  test("works for non-admin who is the correct user.", async function () {
    const resp = await request(app)
        .patch(`/users/u1`)
        .send({
          firstName: "New",
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      user: {
        username: "u1",
        firstName: "New",
        lastName: "U1L",
        email: "user1@user.com",
        isAdmin: false,
      },
    });
  });

  test("unauth for non-admin who are not the correct user.", async function () {
    const resp = await request(app)
        .patch(`/users/u2`)
        .send({
          firstName: "New",
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.status).toBe(401);
  });


  test("unauth for anon", async function () {
    const resp = await request(app)
        .patch(`/users/u1`)
        .send({
          firstName: "New",
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no such user", async function () {
    const adminToken = await registerAdminUser();
    const resp = await request(app)
        .patch(`/users/nope`)
        .send({
          firstName: "Nope",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request if invalid data", async function () {
    const adminToken = await registerAdminUser();
    const resp = await request(app)
        .patch(`/users/u1`)
        .send({
          firstName: 42,
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("works: set new password", async function () {
    const resp = await request(app)
        .patch(`/users/u1`)
        .send({
          password: "new-password",
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      user: {
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "user1@user.com",
        isAdmin: false,
      },
    });
    const isSuccessful = await User.authenticate("u1", "new-password");
    expect(isSuccessful).toBeTruthy();
  });
});

/************************************** DELETE /users/:username */

describe("DELETE /users/:username", function () {
  test("works for admin", async function () {
    const adminToken = await registerAdminUser();
    const resp = await request(app)
        .delete(`/users/u1`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ deleted: "u1" });
  });

  test("works for correct users", async function () {
    const resp = await request(app)
        .delete(`/users/u1`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ deleted: "u1" });
  });

  test("unauth for non-admin who is not the correct users", async function () {
    const resp = await request(app)
        .delete(`/users/u2`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.status).toBe(401);
  });
  
  test("unauth for anon", async function () {
    const resp = await request(app)
        .delete(`/users/u1`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if user missing", async function () {
    const adminToken = await registerAdminUser();
    const resp = await request(app)
        .delete(`/users/nope`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** POST /users/:username/jobs/:id */

describe("POST /users/:username/jobs/:id", function () {
  test("works for admin", async function () {
    const adminToken = await registerAdminUser();
    const resp = await request(app)
        .post(`/users/u1/jobs/1`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ applied: "1" });
  });

  test("works for correct users", async function () {
    const resp = await request(app)
        .post(`/users/u1/jobs/1`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ applied: "1" });
  });

  test("unauth for non-admin who is not the correct users", async function () {
    const resp = await request(app)
        .post(`/users/u2/jobs/1`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.status).toBe(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .post(`/users/u2/jobs/1`)
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if user or job_id missing/invalid", async function () {
    const adminToken = await registerAdminUser();

    //Username not found    
    let resp = await request(app)
        .post(`/users/u0/jobs/1`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
    
  });

  test("not found if job_id missing/invalid", async function () {
    const adminToken = await registerAdminUser();

    //Job id not found
    let resp = await request(app)
        .post(`/users/u1/jobs/0`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
    
  });

  
});


/************************************** POST /users/:username/tech-skills/:id */

describe("POST /users/:username/tech-skills/:id", function () {
  test("works for admin", async function () {
    const adminToken = await registerAdminUser();
    const resp = await request(app)
        .post(`/users/u1/tech-skills/1`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ status: `Tech skill (id=${1}) added.` });
  });

  test("works for correct users", async function () {
    const resp = await request(app)
        .post(`/users/u1/tech-skills/1`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ status: `Tech skill (id=${1}) added.` });
  });

  test("unauth for non-admin who is not the correct users", async function () {
    const resp = await request(app)
        .post(`/users/u2/tech-skills/1`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.status).toBe(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .post(`/users/u1/tech-skills/1`)
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if username missing/invalid", async function () {
    const adminToken = await registerAdminUser();

    //Username not found    
    const resp = await request(app)
        .post(`/users/u0/tech-skills/1`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
    
  });

  test("not found if tech_id missing/invalid", async function () {
    const adminToken = await registerAdminUser();

    //Tech id not found
    const resp = await request(app)
        .post(`/users/u1/tech-skills/0`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
    
  });
  
});





/************************************** GET /users/:username/tech-skills */

describe("GET /users/:username/tech-skills", function () {
  test("works for admin", async function () {
    const adminToken = await registerAdminUser();

    await request(app)
        .post(`/users/u1/tech-skills/1`)
        .set("authorization", `Bearer ${adminToken}`);

    await request(app)
        .post(`/users/u1/tech-skills/2`)
        .set("authorization", `Bearer ${adminToken}`);

    const resp = await request(app)
        .get(`/users/u1/tech-skills`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ tech_skills: [{id:1,name:'Python'},{id:2,name:'Javascript'}] });
  });

  test("works for correct users", async function () {
    await request(app)
        .post(`/users/u1/tech-skills/1`)
        .set("authorization", `Bearer ${u1Token}`);

    await request(app)
        .post(`/users/u1/tech-skills/2`)
        .set("authorization", `Bearer ${u1Token}`);

    const resp = await request(app)
        .get(`/users/u1/tech-skills`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ tech_skills: [{id:1,name:'Python'},{id:2,name:'Javascript'}] });

  });

  test("works if no skills", async function () {
    const resp = await request(app)
        .get(`/users/u1/tech-skills`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ tech_skills: "No tech skills found for u1." });
  });

  test("unauth for non-admin who is not the correct users", async function () {
    const resp = await request(app)
        .get(`/users/u2/tech-skills`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.status).toBe(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .get(`/users/u2/tech-skills`)
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if username missing/invalid", async function () {
    const adminToken = await registerAdminUser();

    const resp = await request(app)
        .get(`/users/u0/tech-skills`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
    
  });
  
});

/************************************** GET /users/:username/matching-jobs */

describe("GET /users/:username/matching-jobs", function () {
  test("works for admin", async function () {
    const adminToken = await registerAdminUser();

    await request(app).post(`/users/u1/tech-skills/1`).set("authorization", `Bearer ${adminToken}`);
    await request(app).post(`/users/u1/tech-skills/2`).set("authorization", `Bearer ${adminToken}`);

    await request(app).post(`/jobs/1/tech-skills/1`).set("authorization", `Bearer ${adminToken}`);
    await request(app).post(`/jobs/2/tech-skills/2`).set("authorization", `Bearer ${adminToken}`);


    const resp = await request(app)
        .get(`/users/u1/matching-jobs`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ matching_jobs: [
      {
        id: 1,
        title: "J1",
        salary: 80000,
        equity: "1.0",
        company_handle: 'c1'
      },
      {
          id: 2,
          title: "J2",
          equity: "0.8",
          salary: 70000,
          company_handle: 'c2'                
      }
    ] });
  });

  test("works for correct users", async function () {
    await request(app).post(`/users/u1/tech-skills/1`).set("authorization", `Bearer ${u1Token}`);
    await request(app).post(`/users/u1/tech-skills/2`).set("authorization", `Bearer ${u1Token}`);

    const adminToken = await registerAdminUser();
    await request(app).post(`/jobs/1/tech-skills/1`).set("authorization", `Bearer ${adminToken}`);
    await request(app).post(`/jobs/2/tech-skills/2`).set("authorization", `Bearer ${adminToken}`);

    const resp = await request(app)
        .get(`/users/u1/matching-jobs`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ matching_jobs: [
      {
        id: 1,
        title: "J1",
        salary: 80000,
        equity: "1.0",
        company_handle: 'c1'
      },
      {
          id: 2,
          title: "J2",
          equity: "0.8",
          salary: 70000,
          company_handle: 'c2'                
      }
    ] });

  });

  test("empty results if no match", async function () {
    await request(app).post(`/users/u1/tech-skills/1`).set("authorization", `Bearer ${u1Token}`);

    const adminToken = await registerAdminUser();
    await request(app).post(`/jobs/1/tech-skills/3`).set("authorization", `Bearer ${adminToken}`);
    await request(app).post(`/jobs/2/tech-skills/2`).set("authorization", `Bearer ${adminToken}`);

    const resp = await request(app)
        .get(`/users/u1/matching-jobs`)
        .set("authorization", `Bearer ${u1Token}`);
    
    expect(resp.body).toEqual({ matching_jobs: [] });
  });

  test("unauth for non-admin who is not the correct users", async function () {
    const resp = await request(app)
        .get(`/users/u2/matching-jobs`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.status).toBe(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .get(`/users/u2/matching-jobs`)
    expect(resp.statusCode).toEqual(401);
  });
  
});
