const passport = require("passport");
const router = require("express").Router();
const express = require("express");
const User = require("../models/userschema");
const PostsSchema = require("../models/postschema");
const mongoose = require("mongoose");

const ensureAuth = (req, res, next) => {
  console.log("inside ensure auth");
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.send("notloggedin");
  }
};

router.post("/teamup/getpost", ensureAuth, (req, res) => {
  // console.log(req.)
  if (req.body.postid !== null) {
    const postid = req.body.postid.id;
    console.log("inside function", postid);
    let geteditpost = async () => {
      const getpostdata = await PostsSchema.findOne({
        _id: mongoose.Types.ObjectId(postid),
      });
      console.log(getpostdata);
      res.send(getpostdata);
    };
    geteditpost();
  } else {
    res.send({ Requirements: "", Skill: "", Tag: [], Description: "" });
  }
});

module.exports = router;
