var mongoose = require("mongoose");
const Request = require('./request').schema;

const AvailabilitySchema = new mongoose.Schema({
  person_id: String,
  display_name: String,
  email: String,
  method: String,
  start_date: String,
  end_date: String,
  start_time: String,
  end_time: String,
  requests:[Request],
  denied:[],
  confirmed: [],
  // pending: [],
  created_at:String,
});

// export class Availability {
//   bid:string;
//   method:string;
//   date:string;
//   timeend:string;
//   name:string = null;
//   bemail:string;
//   cemail:string;
//   formatted_address:string = null;
//   lng:number = null;
//   lat:number = null;
//   split_address:[]=[];
//   denied:[]=[];
//   confirmed:string="";
//   pending:[]=[];
// }
var Availability = mongoose.model("Availability", AvailabilitySchema);
module.exports = Availability;
