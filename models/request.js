var mongoose = require("mongoose");

const Availability = require("./availability").schema;

const RequestSchema = new mongoose.Schema({
  availability_id: String,
  sender_id: String,
  recipient_id: String,
  sender_name: String,
  sender_tech_lang: [],
  sender_home_city: String,
  sender_experience: String,
  sender_profile_img: String,
  requested_date: String,
  requested_time: String,
  created_at: String,
  method: String,
  avail_creator: String,
});

var Request = mongoose.model("Request", RequestSchema);
module.exports = Request;
