const passport = require("passport");
const router = require("express").Router();
const express = require("express");
const User = require("../models/userschema");
const postschema = require("../models/postschema");
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

router.get("/", ensureAuth, (req, res) => {
  let starredinternarray = [];
  let starredeventarray = [];
  let deleted = [];
  async function getpost() {
    for (let i = 0; i < req.user.StarredIntern.length; i++) {
      const postdata = await postschema.findOne(
        {
          _id: req.user.StarredIntern[i].Post_id,
        },
        { "Files.data": 0 }
      );
      console.log("post", postdata);
      if (postdata == null || postdata == undefined) {
        // deleted.push(req.user.StarredIntern[i].Post_id);
        const result = await User.updateOne(
          { _id: req.user.id },
          {
            $pull: {
              StarredIntern: {
                Post_id: mongoose.Types.ObjectId(
                  req.user.StarredIntern[i].Post_id
                ),
              },
            },
          }
        );
      } else {
        starredinternarray.push(postdata);
      }
    }

    for (let i = 0; i < req.user.StarredEvents.length; i++) {
      const postdata = await postschema.findOne(
        {
          _id: req.user.StarredEvents[i].Post_id,
        },
        { "Files.data": 0 }
      );
      console.log("post", postdata);
      if (postdata == null || postdata == undefined) {
        // deleted.push(req.user.StarredIntern[i].Post_id);
        const result = await User.updateOne(
          { _id: req.user.id },
          {
            $pull: {
              StarredEvents: {
                Post_id: mongoose.Types.ObjectId(
                  req.user.StarredEvents[i].Post_id
                ),
              },
            },
          }
        );
      } else {
        starredeventarray.push(postdata);
      }
    }

    // console.log(starredinternarray);
    res.send([starredinternarray, starredeventarray]);
  }
  getpost();
  //   async function deletestarpost() {
  //     for (let i = 0; i < deleted.length; i++) {
  //       const result = await User.updateOne(
  //         { _id: req.user.id },
  //         {
  //           $pull: {
  //             StarredIntern: { Post_id: mongoose.Types.ObjectId(deleted[i]) },
  //           },
  //         }
  //       );
  //     }
  //   }
  //   deletestarpost();
});

module.exports = router;
