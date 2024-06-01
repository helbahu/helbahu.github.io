const express = require("express");

const User = require("../models/user");
const ExpressError = require("../expressError");
const { ensureCorrectUser } = require("../middleware/auth");

const router = new express.Router();


/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get("/", async function(req, res, next) {
    try {
        const users = await User.all();
        return res.json({users});
  
    } catch (err) {
        return next(err);
    }
});

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
router.get("/:username",ensureCorrectUser, async function(req, res, next) {
    try {
        const user = await User.get(req.params.username);
        if(user.length === 0){
            throw new ExpressError("User not found.",404);            
        }
        return res.json({user});

    } catch (err) {
        return next(err);
    }
});


//NOTE: This route will GET all the messages sent to this user.
/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/to",ensureCorrectUser, async function(req, res, next) {
    try {
        const messages = await User.messagesTo(req.params.username);
        return res.json({messages});
        
    } catch (err) {
        return next(err);
    }
});


//NOTE: This route will GET all the messages sent from this user.
/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/from",ensureCorrectUser, async function(req, res, next) {
    try {
        const messages = await User.messagesFrom(req.params.username);
        return res.json({messages});
    } catch (err) {
        return next(err);
    }
});




module.exports = router;