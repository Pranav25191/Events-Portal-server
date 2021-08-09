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
  // console.log(req.files);
  upload(req, res, (err) => {
    if (err) {
      res.send(err);
    } else {
      // console.log(req.body.role);
      // console.log(req.files);
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
        console.log(req.body.deadline);
        const datatobeuploaded = new internshipschema({
          Type: 2,
          Name: req.user.Name,
          User_Id: req.user.id,
          RoleIntern: req.body.role,
          CompanyIntern: req.body.company,
          DurationIntern: req.body.duration,
          StipendIntern: req.body.stipend,
          BranchesIntern: req.body.branches.split(","),
          DeadlineIntern: req.body.deadline,
          DescriptionIntern: req.body.description,
          Files: filesList,
        });
        const result = await datatobeuploaded.save();
        const result2 = await User.updateOne(
          { _id: req.user.id },
          {
            $push: {
              Myposts: { Post_id: mongoose.Types.ObjectId(result.id), Type: 2 },
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
  // console.log("inside  / function");
  const get_data = async () => {
    const postdata = await internshipschema.find(
      {
        Type: 2,
      },
      { "Files.data": 0 }
    );
    // console.log(postdata[0].Files);
    const datatobesent = [];
    for (let i = 0; i < postdata.length; i++) {
      const files = [];
      for (let j = 0; j < postdata[i].Files.length; j++) {
        files.push({
          FileName: postdata[i].Files[j].fileName,
          FileType: postdata[i].Files[j].contentType,
        });
      }
      let starred = false;
      for (let k = 0; k < req.user.StarredIntern.length; k++) {
        // console.log(postdata[i].id, " ", req.user.StarredIntern[k].Post_id);
        if (postdata[i].id == req.user.StarredIntern[k].Post_id) {
          starred = true;
          break;
        }
      }
      // const starred = false;
      // if (req.user.StarredIntern.includes({ Post_id: postdata[i].id })) {
      //   starred = true;
      // }
      // var __FOUND = req.user.StarredIntern.find(function (post, index) {
      //   if (post.Post_id == postdata[i].id) {
      //     starred = true;
      //     return;
      //   }
      // });

      // console.log(postdata[i].RoleIntern, " ", starred);
      const post = {
        _id: postdata[i].id,
        Name: postdata[i].Name,
        User_Id: postdata[i].User_Id,
        Role: postdata[i].RoleIntern,
        Company: postdata[i].CompanyIntern,
        Branches: postdata[i].BranchesIntern,
        Duration: postdata[i].DurationIntern,
        Stipend: postdata[i].StipendIntern,
        Deadline: postdata[i].DeadlineIntern,
        Description: postdata[i].DescriptionIntern,
        FilesName: files,
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
      fetchdata = await internshipschema.findOne({
        _id: mongoose.Types.ObjectId(req.body.postid),
      });
    } catch (err) {
      return res.send("404");
    }
    // console.log(fetchdata);
    if (fetchdata != null) {
      const post = {
        _id: fetchdata.id,
        Name: fetchdata.Name,
        User_Id: fetchdata.User_Id,
        Role: fetchdata.RoleIntern,
        Company: fetchdata.CompanyIntern,
        Duration: fetchdata.DurationIntern,
        Branches: fetchdata.BranchesIntern,
        Stipend: fetchdata.StipendIntern,
        Deadline: fetchdata.DeadlineIntern,
        Description: fetchdata.DescriptionIntern,
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
    const result = await internshipschema.deleteOne({
      _id: mongoose.Types.ObjectId(req.body.postid),
    });
    // console.log(result);
    res.send("successfully deleted");
  }
  postdelete();
});

router.post("/edit", ensureAuth, (req, res) => {
  // console.log(req.body.postid.id);
  const get_data = async () => {
    const fetchdata = await internshipschema.findOne({
      _id: mongoose.Types.ObjectId(req.body.postid.id),
    });
    // console.log(fetchdata);
    const post = {
      _id: fetchdata.id,
      Name: fetchdata.Name,
      User_Id: fetchdata.User_Id,
      Role: fetchdata.RoleIntern,
      Company: fetchdata.CompanyIntern,
      Duration: fetchdata.DurationIntern,
      Branches: fetchdata.BranchesIntern,
      Stipend: fetchdata.StipendIntern,
      Deadline: fetchdata.DeadlineIntern,
      Description: fetchdata.DescriptionIntern,
      Files: fetchdata.Files,
    };
    res.send(post);
  };
  get_data();
});

router.post("/edit/submit", ensureAuth, (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.send(err);
    } else {
      // console.log("post id", req.body.postid);

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

        const result = await internshipschema.updateOne(
          { _id: mongoose.Types.ObjectId(req.body.postid) },
          {
            $set: {
              RoleIntern: req.body.role,
              CompanyIntern: req.body.company,
              DurationIntern: req.body.duration,
              StipendIntern: req.body.stipend,
              BranchesIntern: req.body.branches.split(","),
              DeadlineIntern: req.body.deadline,
              DescriptionIntern: req.body.description,
              Files: filesList,
            },
          }
        );
        // console.log("Received request result", result);
        res.send("fine");
      };
      uploadpost();
    }
  });
});

module.exports = router;

// router.use(upload2.array());
// const fileUpload = require("express-fileupload");
// router.use(fileUpload());
// const upload2 = multer();
//const upload = require("../midddleware/upload");

///WORKING MODEL
// router.post("/submit", ensureAuth, (req, res) => {

//   console.log("Got POST request");
//   console.log(req.body);
//   console.log(req.files);

//   const uploadfiles = async (file) => {
//     await file.mv(
//       `/home/noel/Desktop/Events-Portal-server/uploadedFiles/${file.name}`,
//       (err) => {
//         if (err) {
//           console.log(err);
//           //return res.status(500).send(err);
//         }
//       }
//     );
//   };
//   let fileObjsList = [];
//   if (res.files != null) {
//     if (req.files.files.name !== undefined) {
//       console.log("List");
//       fileObjsList = [req.files.files];
//     } else {
//       fileObjsList = req.files.files;
//     }

//     for (let i = 0; i < fileObjsList.length; i++) {
//       let file = fileObjsList[i];
//       console.log(file);
//       uploadfiles(file);
//     }
//   }
//   res.send("seuccessfull");
// });

// console.log("data is", req.body);
// // console.log("data is", req);
// // res.send("success");
// const multipleUpload = async () => {
//   try {
//     console.log("before await")
//     await upload(req, res);
//     console.log(req.files);
//     res.send(`Files has been uploaded.`);
//   } catch (error) {
//     console.log(error);

//     if (error.code === "LIMIT_UNEXPECTED_FILE") {
//       return res.send("Too many files to upload.");
//     }
//     res.send(`Error when trying upload many files: ${error}`);
//   }
// };
// multipleUpload();

// if(req.files.files===NULL) {
//     console.log("No file");
//     return res.status(400).json({msg:'No file uploaded'});
// }
// router.post("/edit/submit", ensureAuth, (req, res) => {
//   // const postid = req.body.postid;
//   // console.log(postid);
//   async function mypostdelete(postid) {
//     const result = await User.updateOne(
//       { _id: req.user.id },
//       {
//         $pull: {
//           Myposts: { Post_id: mongoose.Types.ObjectId(postid) },
//         },
//       }
//     );
//   }

//   async function postdelete(postid) {
//     const result = await internshipschema.deleteOne({
//       _id: mongoose.Types.ObjectId(postid),
//     });
//     console.log("deleted post in post collection ", result);
//     // res.send("successfully deleted");
//   }
//   upload(req, res, (err) => {
//     if (err) {
//       res.send(err);
//     } else {
//       console.log("post id", req.body.postid);
//       mypostdelete(req.body.postid);
//       postdelete(req.body.postid);
//       // console.log(req.files);
//       const uploadpost = async () => {
//         let filesList = [];
//         let flist = req.files;
//         for (let i = 0; i < flist.length; i++) {
//           filesList.push({
//             data: fs.readFileSync(
//               Path.join(
//                 "/home/noel/Desktop/Events-Portal-server/uploadedFiles/" +
//                   flist[i].filename
//               )
//             ),
//             contentType: flist[i].mimetype,
//             fileName: flist[i].originalname,
//           });
//         }

//         const datatobeuploaded = new internshipschema({
//           Type: 2,
//           Name: req.user.Name,
//           User_Id: req.user.id,
//           RoleIntern: req.body.role,
//           CompanyIntern: req.body.company,
//           DurationIntern: req.body.duration,
//           StipendIntern: req.body.stipend,
//           BranchesIntern: req.body.branches.split(","),
//           DeadlineIntern: req.body.deadline,
//           DescriptionIntern: req.body.description,
//           Files: filesList,
//         });
//         const result = await datatobeuploaded.save();
//         const result2 = await User.updateOne(
//           { _id: req.user.id },
//           {
//             $push: {
//               Myposts: {
//                 Post_id: mongoose.Types.ObjectId(result.id),
//                 Type: 2,
//               },
//             },
//           }
//         );
//         console.log(result2);
//       };
//       uploadpost();
//     }
//   });
//   res.send("fine");
// });
