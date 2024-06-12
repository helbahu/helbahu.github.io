"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./jobs.js");
const User = require("./user.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newJob = {
    title: "newJob",
    salary: 50000,
    equity: "1",
    company_handle: "c1",
  };

  test("works", async function () {
    let job = await Job.create(newJob);
    expect(job).toEqual({...newJob,id:expect.any(Number)});

    const getJob = await Job.get(job.id);
    expect(getJob).toEqual(
      {
        id: expect.any(Number),
        title: "newJob",
        salary: 50000,
        equity: "1",
        company: expect.any(Object),
      });
  });

});

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let jobs = await Job.findAll();

    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "J1",
        salary: 80000,
        equity: "1.0",
        company_handle: "c1",    
      },
      {
        id: expect.any(Number),
        title: "J2",
        salary: 70000,
        equity: "0.8",
        company_handle: "c2",    
      },
      {
        id: expect.any(Number),
        title: "J3",
        salary: 100000,
        equity: "0.5",
        company_handle: "c3",    
      },
      {
        id: expect.any(Number),
        title: 'J4',
        salary: 75000,
        equity: "0.1",
        company_handle: 'c1'
      }
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    await db.query(`INSERT INTO jobs (id, title, salary, equity, company_handle)
                    VALUES (9999999, 'J4',99000,1.0,'c3')`);


    let job = await Job.get(9999999);
    expect(job).toEqual({
        id: 9999999,
        title: "J4",
        salary: 99000,
        equity: "1.0",
        company: {
            handle: "c3",
            name: "C3",
            description: "Desc3",
            numEmployees: 3,
            logoUrl: "http://c3.img",                
        }        
    });
  });

  test("not found if no such job", async function () {
    try {
      await Job.get(0);
      fail();
    } catch (err) {
      expect(err.status).toBe(404)
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    title: "J4 - Changed title",
    salary: 80000,
    equity: "0.9",
  };

  test("works", async function () {
    await db.query(`INSERT INTO jobs (id, title, salary, equity, company_handle)
                    VALUES (9999999, 'J4',99000,1.0,'c3')`);

    let job = await Job.update(9999999, updateData);
    expect(job).toEqual({
      id: 9999999,
      company_handle: 'c3',
      ...updateData,
    });

    const result = await Job.get(9999999);
    expect(result).toEqual({
        id: 9999999,
        title: "J4 - Changed title",
        salary: 80000,
        equity: "0.9",    
        company: {
            handle: "c3",
            name: "C3",
            description: "Desc3",
            numEmployees: 3,
            logoUrl: "http://c3.img",                
        }});
  });

  test("works: update some fieldes.", async function () {
    await db.query(`INSERT INTO jobs (id, title, salary, equity, company_handle)
                    VALUES (9999999, 'J4',99000,1.0,'c3')`);

    const updateDataSetNulls = {
        title: "J4 - Changed title"
    };

    let job = await Job.update(9999999, updateDataSetNulls);
    expect(job).toEqual({
        id: 9999999,
        title: "J4 - Changed title",
        salary: 99000,
        equity: "1.0",
        company_handle: "c3"
    });

    const result = await Job.get(9999999);
    expect(result).toEqual({
        id: 9999999,
        title: "J4 - Changed title",
        salary: 99000,
        equity: "1.0",
        company: {
            handle: "c3",
            name: "C3",
            description: "Desc3",
            numEmployees: 3,
            logoUrl: "http://c3.img",                
        }});
        
  });

  test("not found if no such job", async function () {
    try {
      await Job.update(0, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    await db.query(`INSERT INTO jobs (id, title, salary, equity, company_handle)
                    VALUES (9999999, 'J4',99000,1.0,'c3')`);

    try {
      await Job.update(9999999,{});
    } catch (err) {
      expect(err.status).toBe(400)
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await db.query(`INSERT INTO jobs (id, title, salary, equity, company_handle)
                    VALUES (9999999, 'J4',99000,1.0,'c3')`);

    const testBeforeRemoving = await Job.get(9999999);
    expect(testBeforeRemoving).toEqual({
        id: 9999999,
        title: "J4",
        salary: 99000,
        equity: "1.0",
        company: expect.any(Object)        
    })
    await Job.remove(9999999);

    try {
      await Job.get(9999999);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }

  });

  test("not found if no such job", async function () {
    try {
      await Job.remove(0);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


/************************************** add tech skill */
describe("add tech skill", function () {
    test("works", async function () {
      await Job.addTechSkill(1,1);
      const res = await db.query(
          "SELECT job_id, tech_id FROM jobs_technologies WHERE job_id = 1 AND tech_id = 1");
      expect(res.rows[0]).toEqual({
        job_id: 1,
        tech_id: 1
      });
  
    });
  
    test("bad request if duplicate skill", async function () {
      try {
        await Job.addTechSkill(1,1);
        await Job.addTechSkill(1,1);
      } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy();
      }
    });
  
    test("not found if no such jobId or techId", async function () {
      try {
        await Job.addTechSkill(0,1);
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
  
      try {
        await Job.addTechSkill(1,0);
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
  
    });
  
});

/************************************** view tech skill */
describe("view tech skill", function () {
    test("works", async function () {
      await Job.addTechSkill(1,1);
      await Job.addTechSkill(1,2);
  
      const techSkills = await Job.viewTechSkill(1);
      expect(techSkills).toEqual([
        {id:1,name:'Python'},
        {id:2,name:'Javascript'}
      ]);
  
    });
  
    test("message if no skills", async function () {
      const techSkills = await Job.viewTechSkill(1);
      expect(techSkills).toEqual('No tech skills found for this job.');
    });
  
    test("not found if no such username", async function () {
      try {
        await Job.viewTechSkill(0);
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
    
  });
  
/************************************** view matching users */
describe("view matching users", function () {
    test("works", async function () {
      await Job.addTechSkill(1,1);
      await Job.addTechSkill(4,2);

      await User.addTechSkill("u1",1);
      await User.addTechSkill("u1",2);

      const matchedUsers = await Job.matchSkillsWithUsers(1);
      expect(matchedUsers).toEqual([
        {
        "email": "u1@email.com",
        "firstName": "U1F",
        "isAdmin": false,
        "lastName": "U1L",
        "username": "u1"
        },
      ]);
  
    });

    test("empty matching users list if no skills", async function () {
        await User.addTechSkill("u1",1);
        await User.addTechSkill("u1",2);
    
      const matchedJobs = await Job.matchSkillsWithUsers(1);
      expect(matchedJobs).toEqual([]);
  
    });
  
    test("empty matching users list if no matching skills", async function () {
      await Job.addTechSkill(1,3);
      await Job.addTechSkill(4,3);

      await User.addTechSkill("u1",1);
      await User.addTechSkill("u1",2);  
  
      const matchedJobs = await Job.matchSkillsWithUsers(1);
      expect(matchedJobs).toEqual([]);
  
    });
      
  });
  