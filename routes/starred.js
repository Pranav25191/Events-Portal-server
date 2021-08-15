const passport = require("passport");
const router = require("express").Router();
const express = require("express");
const User = require("../models/userschema");
// const internshipschema = require("../models/postschema");
const mongoose = require("mongoose");
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

router.post("/intern/tostar", ensureAuth, (req, res) => {
  const postid = req.body.postid;
  const starpost = async () => {
    const saveddata = await User.updateOne(
      { _id: req.user.id },
      {
        $push: {
          StarredIntern: {
            Post_id: mongoose.Types.ObjectId(req.body.postid),
          },
        },
      }
    );
    // console.log(saveddata);
    res.send("starred");
  };
  starpost();
});

router.post("/intern/tounstar", ensureAuth, (req, res) => {
  async function unstarpost() {
    const result = await User.updateOne(
      { _id: req.user.id },
      {
        $pull: {
          StarredIntern: { Post_id: mongoose.Types.ObjectId(req.body.postid) },
        },
      }
    );
    // console.log(result);
    res.send("unstarred");
  }
  unstarpost();
});

router.post("/events/tostar", ensureAuth, (req, res) => {
  const postid = req.body.postid;
  const starpost = async () => {
    const saveddata = await User.updateOne(
      { _id: req.user.id },
      {
        $push: {
          StarredEvents: {
            Post_id: mongoose.Types.ObjectId(req.body.postid),
          },
        },
      }
    );
    res.send("starred");
  };
  starpost();
});
router.post("/events/tounstar", ensureAuth, (req, res) => {
  async function unstarpost() {
    const result = await User.updateOne(
      { _id: req.user.id },
      {
        $pull: {
          StarredEvents: { Post_id: mongoose.Types.ObjectId(req.body.postid) },
        },
      }
    );
    // console.log(result);
    res.send("unstarred");
  }
  unstarpost();
});

module.exports = router;
