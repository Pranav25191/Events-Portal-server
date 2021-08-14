const mongoose = require("mongoose");
const Postschema = new mongoose.Schema({
  Name: String, //user name
  User_Id: mongoose.Schema.Types.ObjectId, //posted user id
  Requirements: String, //requirements for teamup
  Skill: String, //skill for teamip
  Date: Date, //for ntng
  Type: Number, //1 teamup ;2 internships;3 events
  Tag: [String],
  Description: String, //for evens as well as  teamup of poted user
  RoleIntern: String, //role for internship
  CompanyIntern: String, //company for internship
  DurationIntern: String, //duration for the internship ex:6months 2 months etc..
  StipendIntern: String, //stipend for a internship
  BranchesIntern: [String], //branches eliguible for internship
  DeadlineIntern: { type: Date, expires: 0 }, //deadline for deleting the post and as well as the deadline for a internship
  DescriptionIntern: String, //description for an internship
  Title: String, //Title for Events
  Venue: String, //Venue of event
  Fromdate: Date, //The date and time at which event starts
  Todate: Date, //The date and time at which event ends
  DeadlineEvent: Date, //Registration deadline of event(* if any)
  Club: String, //The club which posted the event/ none if no club posts
  Files: [
    {
      data: Buffer,
      contentType: String,
      fileName: String,
    },
  ], //Any files sent through internship/event form
});

const Form_data = mongoose.model("Post", Postschema);

module.exports = Form_data;

//   createdAt: { type: Date, expires: 10},
// Postschema.index(({ DeadlineIntern: 1 }, { expireAfterSeconds:0 }));
