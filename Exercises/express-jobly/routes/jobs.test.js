"use strict";

const request = require("supertest");
const Job = require("../models/jobs");
const User = require("../models/user");
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

/************************************** POST /jobs */

describe("POST /jobs", function () {
  const newJob = {
    title: "newJob",
    salary: 80000,
    equity: 0.8,
    company_handle: 'c1'
  };

  test("ok for users who are admins.", async function () {
    const adminToken = await registerAdminUser();
    const resp = await request(app)
        .post("/jobs")
        .send(newJob)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body.job).toEqual({
        id: expect.any(Number),
        title: "newJob",
        salary: 80000,
        equity: "0.8",
        company_handle: 'c1'    
    });
  });

  test("Unauthorized for users who are not admins.", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send(newJob)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });
  
  test("bad request with missing data", async function () {
    const adminToken = await registerAdminUser();
    const resp = await request(app)
        .post("/jobs")
        .send({
          title: "newJOb",
          salary: 61000
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const adminToken = await registerAdminUser();
    const resp = await request(app)
        .post("/jobs")
        .send({
          title: "newJOb",
          salary: 61000,
          invalidKey: "invalid data"
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);

    const resp2 = await request(app)
        .post("/jobs")
        .send({
            title: "newJob",
            salary: "money",
            equity: 0.8,
            company_handle: 'c1'        
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp2.statusCode).toEqual(400);

  });
});

/************************************** GET /jobs */

describe("GET /jobs", function () {
  test("ok for anon", async function () {
    const resp = await request(app).get("/jobs");
    expect(resp.body).toEqual({
      jobs:
          [
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
            },
            {
                id: 3,
                title: "J3",
                equity: "0",
                salary: 100000,
                company_handle: 'c3'                 
            },
            {
                id: 4,
                title: 'J4',
                salary: 75000,
                equity: "0.1",
                company_handle: 'c1'
            },

          ],
    });
  });

  test("Test filtering feature.", async function () {
    let resp = await request(app).get("/jobs?title=J2");
    expect(resp.body).toEqual({
      jobs:
          [
            {
                id: 2,
                title: "J2",
                equity: "0.8",
                salary: 70000,
                company_handle: 'c2'
            }
          ],
    });

    resp = await request(app).get("/jobs?hasEquity=true");
    expect(resp.body).toEqual({
      jobs:
          [
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
            },
            {
                id: 4,
                title: 'J4',
                salary: 75000,
                equity: "0.1",
                company_handle: 'c1'
            },            
          ],
    }); 

    resp = await request(app).get("/jobs?minSalary=75000");
    expect(resp.body).toEqual({
      jobs:
          [
            {
                id: 1,
                title: "J1",
                salary: 80000,
                equity: "1.0",
                company_handle: 'c1'
            },
            {
                id: 3,
                title: "J3",
                equity: "0",
                salary: 100000,
                company_handle: 'c3'                 
            },
            {
                id: 4,
                title: 'J4',
                salary: 75000,
                equity: "0.1",
                company_handle: 'c1'
            }                

          ],
    }); 

    resp = await request(app).get("/jobs?minSalary=90000&companyHandle=3");    
    expect(resp.body).toEqual({
      jobs:
          [
            {
                id: 3,
                title: "J3",
                equity: "0",
                salary: 100000,
                company_handle: 'c3'                 
            }            
          ],
    });
    
    resp = await request(app).get("/jobs?title=x");    
    expect(resp.body).toEqual({
      jobs:
          [],
    });
  });

  test("Test filtering feature errors.", async function () {
    let resp = await request(app).get("/jobs?minSalary=string");
    expect(resp.status).toBe(400)
    expect(JSON.parse(resp.text).error.message).toEqual("Invalid query value: minSalary must be a number greater than or equal to 0.")    

    resp = await request(app).get("/jobs?minSalary=-500");
    expect(resp.status).toBe(400)
    expect(JSON.parse(resp.text).error.message).toEqual("Invalid query value: minSalary must be a number greater than or equal to 0.")    

    resp = await request(app).get("/jobs?title=j2&invalidQuery=5");
    expect(resp.status).toBe(400)
    expect(JSON.parse(resp.text).error.message).toEqual("Invalid query.")    

  });

  test("fails: test next() handler", async function () {
    // there's no normal failure event which will cause this route to fail ---
    // thus making it hard to test that the error-handler works with it. This
    // should cause an error, all right :)
    await db.query("DROP TABLE jobs CASCADE");
    const resp = await request(app)
        .get("/jobs")
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(500);
  });
});

/************************************** GET /jobs/:id */

describe("GET /jobs/:id", function () {
  test("works for anon", async function () {
    const resp = await request(app).get(`/jobs/1`);
    expect(resp.body.job).toEqual({
        id: 1,
        title: "J1",
        salary: 80000,
        equity: "1.0",
        company: {
            handle: "c1",
            name: "C1",
            description: "Desc1",
            numEmployees: 1,
            logoUrl: "http://c1.img",    
        }

    });
  });

  test("not found for no such job", async function () {
    const resp = await request(app).get(`/jobs/0`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** PATCH /jobs/:id */

describe("PATCH /jobs/:id", function () {
  test("works for users who are admins", async function () {
    const adminToken = await registerAdminUser();
    const resp = await request(app)
        .patch(`/jobs/1`)
        .send({
          title: "J1 - New Title",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body.job).toEqual({
        id: 1,
        title: "J1 - New Title",
        salary: 80000,
        equity: "1.0",
        company_handle: "c1"        
    });
  });

  test("Unauthorized for users who are not admins", async function () {
    const resp = await request(app)
        .patch(`/jobs/1`)
        .send({
          title: "J1 - New Title",
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.status).toBe(401)        
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .patch(`/jobs/1`)
        .send({
          title: "J1 - New Title",
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found on no such company", async function () {
    const adminToken = await registerAdminUser();
    const resp = await request(app)
        .patch(`/jobs/0`)
        .send({
          title: "J0 - New Title",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request on id or company_handle change attempt", async function () {
    const adminToken = await registerAdminUser();
    let resp = await request(app)
        .patch(`/jobs/1`)
        .send({
          id: 1000000,
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);

    resp = await request(app)
    .patch(`/jobs/1`)
    .send({
      company_handle: 'c2',
    })
    .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });


  test("bad request on invalid data", async function () {
    const adminToken = await registerAdminUser();
    let resp = await request(app)
        .patch(`/jobs/1`)
        .send({
          title: 300,
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);

    resp = await request(app)
    .patch(`/jobs/1`)
    .send({
      invalidInput: "text",
    })
    .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);    
  });
});

/************************************** DELETE /jobs/:id */

describe("DELETE /jobs/:id", function () {
  test("works for users who are admins", async function () {
    const adminToken = await registerAdminUser();
    const resp = await request(app)
        .delete(`/jobs/1`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ deleted: "1" });

    const testIfDeleted = await request(app).get("/jobs");
    expect(testIfDeleted.body.jobs).toEqual([
            {
                id: 2,
                title: "J2",
                equity: "0.8",
                salary: 70000,
                company_handle: 'c2'                
            },
            {
                id: 3,
                title: "J3",
                equity: "0",
                salary: 100000,
                company_handle: 'c3'                 
            },
            {
                id: 4,
                title: 'J4',
                salary: 75000,
                equity: "0.1",
                company_handle: 'c1'
            }                
          ]);
  });

  test("Unauthorized for users who are not admins", async function () {
    const resp = await request(app)
        .delete(`/jobs/1`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.status).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .delete(`/jobs/1`)
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such company", async function () {
    const adminToken = await registerAdminUser();
    const resp = await request(app)
        .delete(`/jobs/0`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});


/************************************** POST /jobs/:jobId/tech-skills/:id */

describe("POST /jobs/:jobId/tech-skills/:id", function () {
    test("works for admin", async function () {
      const adminToken = await registerAdminUser();
      const resp = await request(app)
          .post(`/jobs/1/tech-skills/1`)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.body).toEqual({ status: `Tech skill (id=${1}) added.` });
    });
  
    test("unauth for non-admin", async function () {
      const resp = await request(app)
          .post(`/jobs/1/tech-skills/1`)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.status).toBe(401);
    });
  
    test("unauth for anon", async function () {
      const resp = await request(app)
          .post(`/jobs/1/tech-skills/1`)
      expect(resp.statusCode).toEqual(401);
    });
  
    test("not found if job_id missing/invalid", async function () {
      const adminToken = await registerAdminUser();
  
      //Job id not found    
      const resp = await request(app)
          .post(`/jobs/0/tech-skills/1`)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(404);
      
    });
  
    test("not found if tech_id missing/invalid", async function () {
      const adminToken = await registerAdminUser();
  
      //Tech id not found
      const resp = await request(app)
          .post(`/jobs/1/tech-skills/0`)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(404);
      
    });
    
  });
  
  
  /************************************** GET /jobs/:jobId/tech-skills */
  
  describe("POST /jobs/:jobId/tech-skills", function () {
    test("works for admin", async function () {
      const adminToken = await registerAdminUser();
  
      await request(app)
          .post(`/jobs/1/tech-skills/1`)
          .set("authorization", `Bearer ${adminToken}`);

      await request(app)
          .post(`/jobs/1/tech-skills/2`)
          .set("authorization", `Bearer ${adminToken}`);
          
  
      const resp = await request(app)
          .get(`/jobs/1/tech-skills`)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.body).toEqual({ tech_skills: [{id:1,name:'Python'},{id:2,name:'Javascript'}] });
    });
  
  
    test("works if no skills", async function () {
      const adminToken = await registerAdminUser();
      const resp = await request(app)
          .get(`/users/u1/tech-skills`)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.body).toEqual({ tech_skills: "No tech skills found for u1." });
    });
  
    test("unauth for non-admin", async function () {
      const resp = await request(app)
          .get(`/jobs/1/tech-skills`)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.status).toBe(401);
    });
  
    test("unauth for anon", async function () {
      const resp = await request(app)
          .get(`/jobs/1/tech-skills`)
      expect(resp.statusCode).toEqual(401);
    });
  
    test("not found if job_id missing/invalid", async function () {
      const adminToken = await registerAdminUser();
  
      const resp = await request(app)
          .get(`/jobs/0/tech-skills`)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(404);
      
    });
    
  });
  

/************************************** GET /users/:username/matching-users */

describe("GET /jobs/:jobId/matching-users", function () {
    test("works for admin", async function () {
      const adminToken = await registerAdminUser();

      await request(app).post(`/jobs/1/tech-skills/1`).set("authorization", `Bearer ${adminToken}`);
      await request(app).post(`/jobs/1/tech-skills/2`).set("authorization", `Bearer ${adminToken}`);
      
      await request(app).post(`/users/u1/tech-skills/1`).set("authorization", `Bearer ${adminToken}`);
      await request(app).post(`/users/u2/tech-skills/2`).set("authorization", `Bearer ${adminToken}`);
  
    
      const resp = await request(app)
          .get(`/jobs/1/matching-users`)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.body).toEqual({ matching_users: [
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
      ] });
    });  
  
    test("empty results if no match", async function () {
      const adminToken = await registerAdminUser();

      await request(app).post(`/jobs/1/tech-skills/1`).set("authorization", `Bearer ${adminToken}`);
      await request(app).post(`/jobs/1/tech-skills/2`).set("authorization", `Bearer ${adminToken}`);
      
      await request(app).post(`/users/u1/tech-skills/1`).set("authorization", `Bearer ${adminToken}`);
      await request(app).post(`/users/u2/tech-skills/2`).set("authorization", `Bearer ${adminToken}`);
  
    
      const resp = await request(app)
          .get(`/jobs/1/matching-users`)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.body).toEqual({ matching_users: [
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
      ] });        
    });
  
    test("unauth for non-admins", async function () {
        const resp = await request(app)
        .get(`/jobs/1/matching-users`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.status).toBe(401);
    });
  
    test("unauth for anon", async function () {
      const resp = await request(app)
          .get(`/users/u2/matching-jobs`)
      expect(resp.statusCode).toEqual(401);
    });
    
  });
  