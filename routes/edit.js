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
      // console.log(getpostdata);
      res.send(getpostdata);
    };
    geteditpost();
  } else {
    res.send({ Requirements: "", Skill: "", Tag: [], Description: "" });
  }
});
router.post("/teamup/update", ensureAuth, (req, res) => {
  // console.log(req.)
  async function updatedata() {
    const result = await PostsSchema.updateOne(
      { _id: mongoose.Types.ObjectId(req.body.postid.id) },
      {
        $set: {
          Requirements: req.body.title,
          Skill: req.body.skill,
          Tag: req.body.tag,
          Description: req.body.description,
        },
      }
    );
    console.log("Received request result", result);
  }
  updatedata();

  if (req.body.oldTitle !== req.body.title) {
    async function updatedata2() {
      const result = await User.updateOne(
        {
          _id: req.user.id,
          "ReceivedRequests.Post_id": mongoose.Types.ObjectId(
            req.body.postid.id
          ),
        },
        {
          $set: {
            "ReceivedRequests.$.PostTitle": req.body.title,
          },
        }
      );
      // console.log("Received request result",result);
      const result2 = req.user.ReceivedRequests;
      for (let i = 0; i < result2.length; i++) {
        if (
          result2[i].Post_id === mongoose.Types.ObjectId(req.body.postid.id)
        ) {
          const updaterequest = await User.updateOne(
            {
              _id: RequestedUser_id,
              "Myrequests.Post_id": mongoose.Types.ObjectId(req.body.postid.id),
            },
            {
              $set: {
                "Myrequests.$.PostTitle": req.body.title,
              },
            }
          );
          console.log(updaterequest);
        }
      }
      res.send("sucess");
    }
    updatedata2();
  } else {
    res.send("success");
  }
});

module.exports = router;
