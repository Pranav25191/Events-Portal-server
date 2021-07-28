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
    // console.log(mypostdata);
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
//   console.log(req.body);
  async function saving() {

    const user_data = await PostsSchema.findOne({
        _id: mongoose.Types.ObjectId(req.body.post_mong_id),
      });
    const saveddata = await User.updateOne(
      { _id: req.user.id },
      {
        $push: {
          Myrequests: {
            Post_id: mongoose.Types.ObjectId(req.body.post_mong_id),
            Description: req.body.AlertDescription,
            ReceivedDescription:"-",
            PostOwner: user_data.Name,
            PostTitle: user_data.Requirements,
            Status: 1,
          },
        },
      }
    );
    console.log("noel kosam",saveddata);
    // const user_data = await PostsSchema.findOne({
    //   _id: mongoose.Types.ObjectId(req.body.post_mong_id),
    // });
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
            PostTitle:user_data.Requirements,
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
                MeetDescription:receivedrequests[i].ReceivedDescription,
                status:receivedrequests[i].Status,
                PostOwner:receivedrequests[i].PostOwner,
                PostTitle:receivedrequests[i].PostTitle,
                id:receivedrequests[i]._id
            }
            datatobesent.push(dummy);
        }
        // console.log(datatobesent)
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
                post:result,
                Description:receivedrequests[i].Description, 
                requestedUser_id:receivedrequests[i].RequestedUser_id, 
                MyDescription:receivedrequests[i].MyDescription,
                name:receivedrequests[i].Name,
                status:receivedrequests[i].status,
                PostTitle:receivedrequests[i].PostTitle
            }
            datatobesent.push(dummy);
        }
        // console.log(datatobesent)
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
        // console.log("Received request result",result);
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
        // console.log("Myrequest result",result);
    } 
    updatedata2();
    res.sendStatus(200);
})


router.post("/myposts/delete",ensureAuth,(req,res)=>{
    const datatobedeleted= toString(req.body.postid);
    console.log("delete data mongo id",datatobedeleted)
    const array=req.user.ReceivedRequests;
    const tobedeletedarray=[]
    for(let i=0;i<array.length;i++){
 
      if(toString(array[i].Post_id)==datatobedeleted){
          tobedeletedarray.push(array[i].RequestedUser_id);
      }
    }
    console.log(tobedeletedarray);
    for(let i=0;i<tobedeletedarray.length;i++){
        async function updatedata2 (){
            const result = await User.updateOne(
                { _id: tobedeletedarray[i], "Myrequests.Post_id":mongoose.Types.ObjectId(req.body.postid) },
                {
                    $set: {
                        "Myrequests.$.Post_id":null
                    }
                }
            )
        } 
        updatedata2();
    }
    async function mypostdelete (){
        const result = await User.updateOne({ _id: req.user.id }, { "$pull": { "Myposts": { "Post_id": mongoose.Types.ObjectId(req.body.postid) } }} );
        console.log(result);
    } 
    mypostdelete();
    console.log( "post id ",mongoose.Types.ObjectId(req.body.postid))
    async function postdelete (){
        const result = await PostsSchema.remove({ _id:  mongoose.Types.ObjectId(req.body.postid)});
        console.log(result);
    } 
    postdelete();
    console.log( "post id ",mongoose.Types.ObjectId(req.body.postid))

    async function mypostdelete1 (){
        const result = await User.updateOne({ _id: req.user.id }, { "$pull": { "ReceivedRequests": { "Post_id": mongoose.Types.ObjectId(req.body.postid) , Status: {"$ne": 2}} }} );
        console.log(result);
    } 
    mypostdelete1();



})

module.exports = router;


