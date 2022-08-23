"use strict";

const Router = require("express").Router;
const router = new Router();
const User= require("../models/user.js");
const jwt = require("jsonwebtoken");
const {SECRET_KEY} = require("../config");
const {UnauthorizedError} = require("../expressError")

/** POST /login: {username, password} => {token} */
router.post("/login", async function (req, res, next) {

  const { username, password } = req.body;

  const loginStatus = await User.authenticate(username,password);
  // make sure to await this, otherwise below statement will always
  // evaluate to truthy and log anyone in.

  if (loginStatus) {
      const token = jwt.sign({ username }, SECRET_KEY);
      return res.json({ token });
  }

  throw new UnauthorizedError("Invalid user/password");

});


/** POST /register: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */

router.post('/register', async function (req, res, next) {

  // const {username, password, first_name, last_name, phone} = req.body;
  //don't need to destructure, just pass in req.body below

  const { username } = await User.register(req.body);
  console.log("username", username)
  // const username = newUser.username

  // const loginStatus =  await User.authenticate(username,password);

  if (username){
    const token = jwt.sign({ username }, SECRET_KEY);
    return res.json({ token });
  }

  throw new UnauthorizedError("Invalid user/password");

});

module.exports = router;