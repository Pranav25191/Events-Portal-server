const mongoose = require("mongoose");
const Postschema = new mongoose.Schema({
  Name: String,
  User_Id: mongoose.Schema.Types.ObjectId,
  Requirements: String,
  Skill: String,
  Date: Date,
  Type: String,
  Tag: [String],
  Description:String
  
});
const Form_data = mongoose.model("Post", Postschema);

module.exports = Form_data;
