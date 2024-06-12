"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureLoggedIn, ensureUserIsAdmin, ensureUserIsAdminOrCorrectUser } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");
const passwordGenerator = require("generate-password");

const router = express.Router();


/** POST / { user }  => { user, token }
 *
 * Adds a new user. This is not the registration endpoint --- instead, this is
 * only for admin users to add new users. The new user being added can be an
 * admin.
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, firstName, lastName, email, isAdmin }, token }
 *
 * Authorization required: login, isAdmin
 **/

router.post("/", ensureLoggedIn, ensureUserIsAdmin, async function (req, res, next) {
  try {

    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    req.body.password = passwordGenerator.generate({length:20,numbers:true});

    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});


/** GET / => { users: [ {username, firstName, lastName, email }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: login
 **/

router.get("/", ensureLoggedIn, ensureUserIsAdmin, async function (req, res, next) {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});


/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, isAdmin }
 *
 * Authorization required: login
 **/

router.get("/:username", ensureLoggedIn, ensureUserIsAdminOrCorrectUser, async function (req, res, next) {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email }
 *
 * Returns { username, firstName, lastName, email, isAdmin }
 *
 * Authorization required: login
 **/

router.patch("/:username", ensureLoggedIn, ensureUserIsAdminOrCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.update(req.params.username, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});


/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: login
 **/

router.delete("/:username", ensureLoggedIn, ensureUserIsAdminOrCorrectUser, async function (req, res, next) {
  try {
    await User.remove(req.params.username);
    return res.json({ deleted: req.params.username });
  } catch (err) {
    return next(err);
  }
});

/** POST /[username]/jobs/[id]   =>  { applied: jobId }
 *
 * Authorization required: login
 **/
router.post("/:username/jobs/:id", ensureLoggedIn, ensureUserIsAdminOrCorrectUser, async function (req, res, next) {
  try {
    await User.apply(req.params.username,req.params.id);
    return res.json({ applied: req.params.id });
  } catch (err) {
    return next(err);
  }
});

/** POST /[username]/tech-skills/[id]   =>  { tech_skill: techId }
 *
 * Authorization required: login
 **/
router.post("/:username/tech-skills/:id", ensureLoggedIn, ensureUserIsAdminOrCorrectUser, async function (req, res, next) {
  try {
    await User.addTechSkill(req.params.username,req.params.id);
    return res.json({ status: `Tech skill (id=${req.params.id}) added.` });
  } catch (err) {
    return next(err);
  }
});

/** GET /[username]/tech-skills   =>  { tech_skills: [{ techSkill }, ... ] }
 *
 * Authorization required: login
 **/
router.get("/:username/tech-skills", ensureLoggedIn, ensureUserIsAdminOrCorrectUser, async function (req, res, next) {
  try {
    const tech_skills = await User.viewTechSkill(req.params.username);
    return res.json({ tech_skills });
  } catch (err) {
    return next(err);
  }
});

/** GET /[username]/matching-jobs   =>  { matching_jobs: [{ job }, ... ] }
 *
 * Authorization required: login
 **/
router.get("/:username/matching-jobs", ensureLoggedIn, ensureUserIsAdminOrCorrectUser, async function (req, res, next) {
  try {
    const matching_jobs = await User.matchSkillsWithJobs(req.params.username);
    return res.json({ matching_jobs });
  } catch (err) {
    return next(err);
  }
});



module.exports = router;
