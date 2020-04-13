var mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const Availability = require("./availability").schema;
// const Project = require("./project").schema;
var Project = require("../models/project");

//create a new schema/blueprint that will be save in mongodb database

var UserSchema = new mongoose.Schema({
  display_name: { type: String, required: true },
  home_city: { type: String, required: false },
  profile_image_url: String,
  profile_type: { type: String, required: false },
  email: { type: String, required: true },
  password: {
    type: String,
    required: true,
  },
  tech_languages: { type: Array, required: false },
  experience: String,
  created_at: String,
  availabilities: [Availability],
  new_meeting_requests: [],
  confirmed_meetings: [],
  denied_meetings: [],
  pending_meetings: [],
  friend_requests: [],
  pending_friend_requests: [],
  denied_friend_requests: [],
  confirmed_friend_requests: [],
  projects:[],
  // projects: [
  //   {
  //     type: mongoose.Schema.ObjectId,
  //     ref: "Project",
  //   },
  // ], // availabilities:{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Availability"
  // }
});
//   password_confirm: { type: String, required: true, validate: {
//     validator: function(el) {
//       return el === this.password;
//     }, message:'Passwords are not the same'
//   }},

//create a new collection called user, it will make user plural in monogod

var User = mongoose.model("User", UserSchema);
module.exports = User;

//   user.save();
