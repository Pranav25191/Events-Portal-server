const passport = require("passport");
const router = require("express").Router();
// const FormData = require('form-data');
const express = require("express");
const User = require("../models/userschema");
const teamupschema = require("../models/postschema");
const app = express();
app.use(express.static("public"));

const ensureAuth = (req, res, next) => {
  // console.log("inside ensure auth");
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.send("notloggedin");
  }
};

router.post("/submit", ensureAuth, (req, res) => {
  console.log("data is", req);
  res.send("success");
});

module.exports = router;
