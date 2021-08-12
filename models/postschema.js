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
  DeadlineIntern: { type: Date, expires: 0 },
  DescriptionIntern: String,
  Files: [
    {
      data: Buffer,
      contentType: String,
      fileName: String,
    },
  ],
  //   createdAt: { type: Date, expires: 10},
});
// Postschema.index(({ DeadlineIntern: 1 }, { expireAfterSeconds:0 }));

const Form_data = mongoose.model("Post", Postschema);

module.exports = Form_data;
