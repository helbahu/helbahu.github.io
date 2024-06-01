const express = require("express");

const User = require("../models/user");
const ExpressError = require("../expressError");

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

const router = new express.Router();


/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post("/login", async function(req, res, next) {
    try {
        const user = await User.authenticate(req.body.username,req.body.password);
        if(user){
            await User.updateLoginTimestamp(req.params.username);
            let token = jwt.sign({username:req.body.username},SECRET_KEY);
            return res.json({token});
        }else{
            throw new ExpressError("The username/passord is invalid.",400)
        }
  
    } catch (err) {
        return next(err);
    }
});


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post("/register", async function(req, res, next) {
    try {
        const user = await User.register(req.body);
        if(user){
            let token = jwt.sign({username:req.body.username},SECRET_KEY);
            return res.json({token});    
        }else{
            throw new ExpressError("Registration Failed.",400);
        }
  
    } catch (err) {
        return next(err);
    }
});



module.exports = router;