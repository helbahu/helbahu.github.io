"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const TechSkill = require("./technologies.js");
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


/************************************** getAll */

describe("getAll", function () {
    test("works", async function () {
      let allSkills = await TechSkill.getAll();
  
      expect(allSkills).toEqual([
          {id: expect.any(Number), name: "Javascript"},
          {id: expect.any(Number), name: "Python"},
          {id: expect.any(Number), name: "SQL"},
      ]);
    });
  });


/************************************** create */

describe("create", function () {
  const newTechSkill = {
    name: "Node"
  };

  test("works", async function () {
    let newSkill = await TechSkill.create(newTechSkill);
    expect(newSkill).toEqual({id: expect.any(Number), name: "Node"});

    const getSkills = await TechSkill.getAll();
    expect(getSkills).toEqual([
        {id: expect.any(Number), name: "Javascript"},
        {id: expect.any(Number), name: "Node"},
        {id: expect.any(Number), name: "Python"},
        {id: expect.any(Number), name: "SQL"},
    ]);
  });

});


/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await TechSkill.remove(1);

    const getSkills = await TechSkill.getAll();
    expect(getSkills).toEqual([
        {id: expect.any(Number), name: "Javascript"},
        {id: expect.any(Number), name: "SQL"},
    ]);

  });

  test("not found if no such tech skill", async function () {
    try {
        await TechSkill.remove(0);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

