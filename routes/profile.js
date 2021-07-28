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
            ReceivedDescription:"-",
            Status: 1,
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
            MyDescription:"-",
            Name: req.user.Name,
            RequestedUser_id: req.user.id,
            Status:1
          },
        },
      }
    );

    res.sendStatus(200);
  }
  saving();
});



router.get('/myrequests',ensureAuth,(req,res)=>{
    const receivedrequests = req.user.Myrequests;
    const datatobesent =[]
    async function get_data(){
        for(let i=0;i<receivedrequests.length;i++){
            const result = await PostsSchema.findOne({
                _id:receivedrequests[i].Post_id
            })
            // console.log(result)
            const dummy={
                post:result, 
                Description:receivedrequests[i].Description, 
                status:receivedrequests[i].Status
            }
            datatobesent.push(dummy);
        }
        console.log(datatobesent)
        res.send(datatobesent);
    }
    get_data();
})


router.get('/receivedrequests',ensureAuth,(req,res)=>{
    const receivedrequests = req.user.ReceivedRequests;
    const datatobesent =[]
    async function get_data(){
        for(let i=0;i<receivedrequests.length;i++){
            const result = await PostsSchema.findOne({
                _id:receivedrequests[i].Post_id
            })
            // console.log(result)
            const dummy={
                post:result, Description:receivedrequests[i].Description, 
                requestedUser_id:receivedrequests[i].RequestedUser_id, 
                name:receivedrequests[i].Name,
                status:receivedrequests[i].status
            }
            datatobesent.push(dummy);
        }
        console.log(datatobesent)
        res.send(datatobesent);
    }
    get_data();


});


router.post("/confirmrequest",ensureAuth,(req,res)=>{
    console.log(req.body);
    const PostId= req.body.post_mong_id;
    const requestedUser_id= req.body.requesteduserid;
    const status=req.body.status;
    const meetdescription= req.body.AlertDescription;

    async function updatedata (){
        const result=  await User.updateOne(
                { _id: req.user.id, "ReceivedRequests.Post_id": PostId },
                {
                    $set: {
                        "ReceivedRequests.$.Status": status,
                        "ReceivedRequests.$.MyDescription":meetdescription
                    }
                }
            )
        console.log("Received request result",result);
    } 
    updatedata();
    async function updatedata2 (){
        const result = await User.updateOne(
                { _id: requestedUser_id, "Myrequests.Post_id": PostId },
                {
                    $set: {
                        "Myrequests.$.Status": status,
                        "Myrequests.$.ReceivedDescription":meetdescription
                    }
                }
            )
        console.log("Myrequest result",result);
    } 
    updatedata2();
    res.sendStatus(200);
})

module.exports = router;


