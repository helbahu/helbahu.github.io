"use strict";

/** Routes for companies. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureUserIsAdmin } = require("../middleware/auth");
const Job = require("../models/jobs");

const jobNewSchema = require("../schemas/jobNew.json");
const jobUpdateSchema = require("../schemas/jobUpdate.json");

const router = new express.Router();


/** POST / { job } =>  { job }
 *
 * job should be { title, salary, equity, company_handle }
 *
 * Returns { id, title, salary, equity, company_handle }
 *
 * Authorization required: login, isAdmin
 */

router.post("/", ensureLoggedIn, ensureUserIsAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, jobNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const job = await Job.create(req.body);
    return res.status(201).json({ job });
  } catch (err) {
    return next(err);
  }
});

/** GET /  =>
 *   { jobs: [ { id, title, salary, equity, company_handle }, ...] }
 *
 * Can filter on provided search filters:
 * - title
 * - minSalary
 * - companyHandle
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  try {
    const jobs = await Job.findAll(req.query);
    return res.json({ jobs });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  =>  { job }
 *
 *  job is { id, title, salary, equity, company }
 *   where company is { handle, name, description, numEmployees, logoUrl}
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
  try {
    const job = await Job.get(req.params.id);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[id] { fld1, fld2, ... } => { job }
 *
 * Patches job data.
 *
 * fields can be: { title, salary, equity }
 *
 * Returns { id, title, salary, equity, company_handle }
 *
 * Authorization required: login, isAdmin
 */

router.patch("/:id", ensureLoggedIn, ensureUserIsAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, jobUpdateSchema);

    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const job = await Job.update(req.params.id, req.body);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: login, isAdmin
 */

router.delete("/:id", ensureLoggedIn, ensureUserIsAdmin, async function (req, res, next) {
  try {
    await Job.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});




/** POST /[jobId]/tech-skills/[id]   =>  { tech_skill: techId }
 *
 * Authorization required: login
 **/
router.post("/:jobId/tech-skills/:id", ensureLoggedIn, ensureUserIsAdmin, async function (req, res, next) {
    try {
      await Job.addTechSkill(req.params.jobId,req.params.id);
      return res.json({ status: `Tech skill (id=${req.params.id}) added.` });
    } catch (err) {
      return next(err);
    }
});
  
  /** GET /[jobId]/tech-skills   =>  { tech_skills: [{ techSkill }, ... ] }
   *
   * Authorization required: login
   **/
router.get("/:jobId/tech-skills", ensureLoggedIn, ensureUserIsAdmin, async function (req, res, next) {
    try {
      const tech_skills = await Job.viewTechSkill(req.params.jobId);
      return res.json({ tech_skills });
    } catch (err) {
      return next(err);
    }
});
  

/** GET /[jobId]/matching-users   =>  { matching_users: [{ user }, ... ] }
 *
 * Authorization required: login
 **/
  router.get("/:jobId/matching-users", ensureLoggedIn, ensureUserIsAdmin, async function (req, res, next) {
    try {
      const matching_users = await Job.matchSkillsWithUsers(req.params.jobId);
      return res.json({ matching_users });
    } catch (err) {
      return next(err);
    }
  });



module.exports = router;
