const passport = require("passport");
const router = require("express").Router();
const express = require("express");
const multer = require("multer");
const Path = require("path");
const User = require("../models/userschema");
const eventschema = require("../models/postschema");
const mongoose = require("mongoose");
const app = express();
app.use(express.static("public"));
var fs = require("fs");

// internshipschema.index( { "expireAt": 1 }, { expireAfterSeconds: 0 } )

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
router.post("/submit", ensureAuth, (req, res) => {
  console.log("Got POST request");
  upload(req, res, (err) => {
    if (err) {
      res.send(err);
    } else {
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
        console.log(req.body);
        //   console.log(typeof req.body.deadline);
        const data = {
          Type: 3,
          Name: req.user.Name,
          User_Id: req.user.id,
          Title: req.body.eventtitle,
          Venue: req.body.venue,
          Fromdate: req.body.fromdate,
          Todate: req.body.todate,
          DeadlineIntern: req.body.todate,
          Club: req.body.club,
          Description: req.body.description,
          Files: filesList,
        };
        if (req.body.deadline != "undefined") {
          data["DeadlineEvent"] = req.body.deadline;
        }
        const datatobeuploaded = new eventschema(data);
        const result = await datatobeuploaded.save();
        const result2 = await User.updateOne(
          { _id: req.user.id },
          {
            $push: {
              Myposts: { Post_id: result.id, Type: 3 },
            },
          }
        );
        // console.log(result2);
      };
      uploadpost();
      res.send("fine");
    }
  });
});

router.get("/", ensureAuth, (req, res) => {
  const get_data = async () => {
    const postdata = await eventschema.find(
      {
        Type: 3,
      },
      { "Files.data": 0 }
    );
    const datatobesent = [];
    for (let i = 0; i < postdata.length; i++) {
      let starred = false;
      for (let k = 0; k < req.user.StarredEvents.length; k++) {
        if (postdata[i].id == req.user.StarredEvents[k].Post_id) {
          starred = true;
          break;
        }
      }
      const post = {
        _id: postdata[i].id,
        Name: postdata[i].Name,
        User_Id: postdata[i].User_Id,
        Title: postdata[i].Title,
        Venue: postdata[i].Venue,
        Club: postdata[i].Club,
        FromDate: postdata[i].Fromdate,
        ToDate: postdata[i].Todate,
        DeadlineEvent: postdata[i].DeadlineEvent,
        Description: postdata[i].Description,
        Starred: starred,
      };
      datatobesent.push(post);
    }
    // console.log(datatobesent);
    res.send(datatobesent);
  };
  get_data();
});

router.post("/readmore", ensureAuth, (req, res) => {
  console.log(req.body.postid);
  const get_data = async () => {
    let fetchdata = "";
    try {
      fetchdata = await eventschema.findOne({
        _id: mongoose.Types.ObjectId(req.body.postid),
      });
    } catch (err) {
      return res.sendStatus("404");
    }
    console.log(fetchdata);
    if (fetchdata != null) {
      const post = {
        _id: fetchdata.id,
        Name: fetchdata.Name,
        User_Id: fetchdata.User_Id,
        Title: fetchdata.Title,
        Venue: fetchdata.Venue,
        Fromdate: fetchdata.Fromdate,
        Todate: fetchdata.Todate,
        Club: fetchdata.Club,
        DeadlineEvent: fetchdata.DeadlineEvent,
        Description: fetchdata.Description,
        Files: fetchdata.Files,
      };
      res.send(post);
    } else {
      res.send("post deleted");
    }
  };
  get_data();
});

router.post("/delete", ensureAuth, (req, res) => {
  const postid = req.body.postid;
  // console.log(postid);
  async function mypostdelete() {
    const result = await User.updateOne(
      { _id: req.user.id },
      {
        $pull: {
          Myposts: { Post_id: mongoose.Types.ObjectId(req.body.postid) },
        },
      }
    );
  }
  mypostdelete();
  async function postdelete() {
    const result = await eventschema.deleteOne({
      _id: mongoose.Types.ObjectId(req.body.postid),
    });
    // console.log(result);
    res.send("successfully deleted");
  }
  postdelete();
});

module.exports = router;
