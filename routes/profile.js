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

router.get("/myposts", ensureAuth, (req, res) => {
  async function getdata() {
    const mypostdata = req.user.Myposts;
    console.log(mypostdata);
    let response = [];
    for (let i = 0; i < mypostdata.length; i++) {
      const data = await PostsSchema.findOne({
        _id: mypostdata[i].Post_id,
      });
      response.push(data);
    }
    res.send(response);
  }
  getdata();
});

router.post("/interested", ensureAuth, (req, res) => {
  console.log(req.body);
  async function saving() {
    const saveddata = await User.updateOne(
      { _id: req.user.id },
      {
        $push: {
          Myrequests: {
            Post_id: mongoose.Types.ObjectId(req.body.post_mong_id),
            Description: req.body.AlertDescription,
            Status: false,
          },
        },
      }
    );

    const user_data = await PostsSchema.findOne({
      _id: mongoose.Types.ObjectId(req.body.post_mong_id),
    });
    const UserId = user_data.User_Id;
    const updatedata = await User.updateOne(
      { _id: UserId },
      {
        $push: {
          ReceivedRequests: {
            Post_id: mongoose.Types.ObjectId(req.body.post_mong_id),
            Description: req.body.AlertDescription,
            Name: req.user.Name,
            RequestedUser_id: req.user.id,
          },
        },
      }
    );

    res.sendStatus(200);
  }
  saving();
});

module.exports = router;
