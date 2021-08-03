const mongoose = require("mongoose");
const Postschema = new mongoose.Schema({
  Name: String,
  User_Id: mongoose.Schema.Types.ObjectId,
  Requirements: String,
  Skill: String,
  Date: Date,
  Type: Number,
  Tag: [String],
  Description: String,
  RoleIntern: String,
  CompanyIntern: String,
  DurationIntern: String,
  StipendIntern: String,
  BranchesIntern: [String],
  DeadlineIntern: Date,
  DescriptionIntern: String,
  Files: [
    {
      data: Buffer,
      contentType: String,
      fileName: String,
    },
  ],
});
const Form_data = mongoose.model("Post", Postschema);

module.exports = Form_data;
