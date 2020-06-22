var mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const Request = require("./request").schema;

const AvailabilitySchema = new mongoose.Schema({
  person_id: String,
  display_name: String,
  email: String,
  method: String,
  start_date: String,
  end_date: String,
  start_time: String,
  end_time: String,
  meetings_requests: [Request],
  meetings_denied: [],
  meetings_confirmed: [],
  meetings_pending: [],
  created_at: String,
});

var Availability = mongoose.model("Availability", AvailabilitySchema);
module.exports = Availability;
