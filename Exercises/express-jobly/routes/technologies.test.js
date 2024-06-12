"use strict";

const request = require("supertest");
const Job = require("../models/jobs");
const User = require("../models/user");
const TechSkill = require("../models/technologies");

const { createToken } = require("../helpers/tokens");

const db = require("../db");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
} = require("./_testCommon");
const { BadRequestError } = require("../expressError");

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

/************************************** POST /technologies */

describe("POST /technologies", function () {
  const newSkill = {
    name: 'Node'
  };

  test("works for admins.", async function () {
    const adminToken = await registerAdminUser();
    const resp = await request(app)
        .post("/technologies")
        .send(newSkill)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
        newSkill: {id:expect.any(Number), name: "Node"}
    });
  });

  test("Unauthorized for non-admins.", async function () {
    const resp = await request(app)
        .post("/technologies")
        .send(newSkill)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const adminToken = await registerAdminUser();
    const resp = await request(app)
        .post("/technologies")
        .send({})
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(500);        

  });

});

/************************************** GET /technologies */

describe("GET /technologies", function () {
  test("works for anon", async function () {
    const resp = await request(app).get("/technologies");
    expect(resp.body).toEqual({
      techSkills:
          [
            {
              id: 2,
              name: "Javascript"
            },
            {
                id: 1,
                name: "Python"
              },  
            {
                id: 3,
                name: "SQL",
            },
          ],
    });
  });

});


/************************************** DELETE /technologies/:id */

describe("DELETE /jobs/:id", function () {
  test("works for admins", async function () {
    const adminToken = await registerAdminUser();
    const resp = await request(app)
        .delete(`/technologies/1`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ deleted: "1" });

    const testIfDeleted = await request(app).get("/technologies");
    expect(testIfDeleted.body.techSkills).toEqual([
        {
            id: 2,
            name: "Javascript"
        },
        {
            id: 3,
            name: "SQL",
        },        
        ]);
  });

  test("Unauthorized for non-admins", async function () {
    const resp = await request(app)
        .delete(`/technologies/1`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.status).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .delete(`/technologies/1`)
    expect(resp.statusCode).toEqual(401);
  });

  test("skill with this id not found", async function () {
    const adminToken = await registerAdminUser();
    const resp = await request(app)
        .delete(`/technologies/0`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});
