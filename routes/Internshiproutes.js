const passport = require("passport");
const router = require("express").Router();
const express = require("express");
//const upload = require("../midddleware/upload");
// const multer = require("multer");
// const upload2= multer();
const User = require("../models/userschema");
const app = express();
app.use(express.static("public"));
// router.use(upload2.array);
const fileUpload = require("express-fileupload");
router.use(fileUpload());


const ensureAuth = (req, res, next) => {
  // console.log("inside ensure auth");
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.send("notloggedin");
  }
};



router.post("/submit",ensureAuth, (req, res) => {
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
  
    console.log("Got POST request");
    // console.log(req.body);
    console.log(req.files);
    // if(req.files.files===NULL) {
    //     console.log("No file");
    //     return res.status(400).json({msg:'No file uploaded'});
    // }

    const uploadfiles = async (file)=>{ 
      await file.mv(
        `/home/noel/Desktop/Events-Portal-server/uploadedFiles/${file.name}`,
        (err) => {
          if (err) {
            console.log(err);
             //return res.status(500).send(err);
          }});
    }
    let fileObjsList=[];
    if(req.files.files.name!==undefined) {console.log('List'); fileObjsList=[req.files.files];}
    else
      {fileObjsList = req.files.files;}

    for (let i = 0; i < fileObjsList.length; i++) {
      let file = fileObjsList[i];
      console.log(file);
      uploadfiles(file);
    }
    //   );
    // }
    res.send("seuccessfull");

});

module.exports = router;
