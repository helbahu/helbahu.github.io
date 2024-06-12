"use strict";

const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureUserIsAdmin } = require("../middleware/auth");
const TechSkill = require("../models/technologies");

const router = new express.Router();


/** POST / { name } =>  { newSkill }
 *
 * input should be { name }
 *
 * Returns { id, name }
 *
 * Authorization required: login, isAdmin
 */

router.post("/", ensureLoggedIn, ensureUserIsAdmin, async function (req, res, next) {
  try {
    const newSkill = await TechSkill.create(req.body);
    return res.status(201).json({ newSkill });
  } catch (err) {
    return next(err);
  }
});


/** GET /  =>
 *   { techSkills: [ { id, name }, ...] }
 *
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  try {
    const techSkills = await TechSkill.getAll();
    return res.json({ techSkills });
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
    await TechSkill.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;