const mongoose = require("mongoose");
const userschema = new mongoose.Schema({
  Name: String,
  Mail_Id: String,
  user_profile: String,
  Year: Number,
  Branch: String,
  Myposts: [
    {
      Post_id: mongoose.Schema.Types.ObjectId,
      Type: String,
    },
  ],
  Starred: [
    {
      Post_id: mongoose.Schema.Types.ObjectId,
      Type: String,
    },
  ],
  ReceivedRequests: [
    {
      Post_id: mongoose.Schema.Types.ObjectId,
      Name: String,
      Description: String,
      MyDescription:String,
      RequestedUser_id: mongoose.Schema.Types.ObjectId,
      Status: Number
    },
  ],
  Myrequests: [
    {
      Post_id: mongoose.Schema.Types.ObjectId,
      Description: String,
      ReceivedDescription: String,
      Status: Number,
    },
  ],
});
const User = mongoose.model("UserData", userschema);

module.exports = User;
