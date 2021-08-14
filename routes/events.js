const passport = require("passport");
const router = require("express").Router();
const express = require("express");
const multer = require("multer");
const Path = require("path");
const User = require("../models/userschema");
const internshipschema = require("../models/postschema");
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
        //   console.log(req.body.deadline);
        //   console.log(typeof req.body.deadline);
        const datatobeuploaded = new internshipschema({
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
        });
        const result = await datatobeuploaded.save();
        const result2 = await User.updateOne(
          { _id: req.user.id },
          {
            $push: {
              Myposts: { Post_id: mongoose.Types.ObjectId(result.id), Type: 3 },
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

module.exports = router;
