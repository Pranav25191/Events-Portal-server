const passport = require("passport");
const router = require("express").Router();
const express = require("express");
const User = require("../models/userschema");
const PostsSchema = require("../models/postschema");
const Path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");
var fs = require("fs");

const storage = multer.diskStorage({
  destination: "/home/noel/Desktop/Events-Portal-server/uploadedFiles",
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname + "-" + Date.now() + Path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
}).array("files");

const ensureAuth = (req, res, next) => {
  // console.log("inside ensure auth");
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
router.post("/events/getpost", ensureAuth, (req, res) => {
  console.log(req.body.postid.id);
  const get_data = async () => {
    const fetchdata = await PostsSchema.findOne(
      {
        _id: mongoose.Types.ObjectId(req.body.postid.id),
      },
      { Files: 0 }
    );
    // console.log(fetchdata);
    const data = {
      Type: 3,
      Name: fetchdata.Name,
      User_Id: fetchdata.id,
      Title: fetchdata.Title,
      Venue: fetchdata.Venue,
      Fromdate: fetchdata.Fromdate,
      Todate: fetchdata.Todate,
      Club: fetchdata.Club,
      Description: fetchdata.Description,
    };
    if (fetchdata.DeadlineEvent != undefined) {
      data["DeadlineEvent"] = fetchdata.DeadlineEvent;
    }
    console.log(data);
    res.send(data);
  };
  get_data();
});
router.post("/events/submit", ensureAuth, (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.send(err);
    } else {
      console.log("body", req.body);

      const uploadpost = async () => {
        let filesList = [];
        let flist = req.files;
        for (let i = 0; i < flist.length; i++) {
          filesList.push({
            data: fs.readFileSync(
              Path.join(
                "/home/noel/Desktop/Events-Portal-server/uploadedFiles/" +
                  flist[i].filename
              )
            ),
            contentType: flist[i].mimetype,
            fileName: flist[i].originalname,
          });
        }
        if (req.body.deadline != undefined || req.body.deadline != "") {
          const result = await PostsSchema.updateOne(
            { _id: mongoose.Types.ObjectId(req.body.postid) },
            {
              $set: {
                Type: 3,
                Name: req.user.Name,
                User_Id: req.user.id,
                Title: req.body.eventtitle,
                Venue: req.body.venue,
                Fromdate: req.body.fromdate,
                Todate: req.body.todate,
                Club: req.body.club,
                DeadlineEvent: req.body.deadline,
                Description: req.body.description,
                Files: filesList,
              },
            }
          );
        } else {
          const result = await PostsSchema.updateOne(
            { _id: mongoose.Types.ObjectId(req.body.postid) },
            {
              $set: {
                Type: 3,
                Name: req.user.Name,
                User_Id: req.user.id,
                Title: req.body.eventtitle,
                Venue: req.body.venue,
                Fromdate: req.body.fromdate,
                Todate: req.body.todate,
                Club: req.body.club,
                Description: req.body.description,
                Files: filesList,
              },
            }
          );
          console.log(result);
        }
        // console.log("Received request result", result);
        res.send("fine");
      };
      uploadpost();
    }
  });
});

module.exports = router;
