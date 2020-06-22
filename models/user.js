var mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const Availability = require("./availability").schema;
var Project = require("../models/project");

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
  projects: [],
});

var User = mongoose.model("User", UserSchema);
module.exports = User;
