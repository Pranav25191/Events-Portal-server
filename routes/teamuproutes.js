const passport = require("passport");
const router = require("express").Router();
const express = require("express");
const User = require("../models/userschema");
const teamupschema = require("../models/postschema");
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

router.post("/submit", ensureAuth, (req, res) => {
  const data = new teamupschema({
    Name: req.user.Name,
    Type: "Teamup",
    User_Id: req.user.id,
    Requirements: req.body.title,
    Skill: req.body.skill,
    Tag: req.body.tag,
    Description: req.body.description,
  });
  async function saving() {
    const result = await data.save();
    const mypostarray = req.user.Myposts.push({
      Post_id: result.id,
      Type: "Teamup",
    });
    // console.log(mypostarray);
    const saveddata = await User.updateOne(
      { _id: req.user.id },
      {
        $push: {
          Myposts: {
            Post_id: result.id,
            Type: "Teamup",
          },
        },
      }
    );
    res.sendStatus(200);
  }
  saving();
});

router.get("/", ensureAuth, (req, res) => {
  async function getdata() {
    const data = await teamupschema.find({
      Type: "Teamup",
      User_Id: { $ne: req.user.id },
    });
    let datatobesent=[] ;
    const reqArray=req.user.Myrequests
    for(let i=0;i<data.length;i++){
        flag=true
        for(let j=0;j<reqArray.length;j++){
            if (data[i].id==reqArray[j].Post_id){
                flag=false;
                break;
            }
        }
        if (flag==true) datatobesent.push(data[i]);
    }
    // console.log(datatobesent);
    // console.log(data);
    res.send(datatobesent);
  }
  getdata();
});

module.exports = router;

//Extra syntax
//db.user.find( { _id: { $nin: [ObjectId("5848e9ecaec0f31372816a26")] } } )
