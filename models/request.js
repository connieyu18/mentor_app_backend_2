var mongoose = require("mongoose");

const Availability = require('./availability').schema;

const RequestSchema = new mongoose.Schema({
  availability_id: String,
  sender_id: String,
  recipient_id: String,
  sender_name:String, 
  sender_tech_lang:[],
  sender_home_city:String,  
  sender_experience:String,
  requested_date: String,
  requested_time: String,
  created_at: String, 
  method:String,
  avail_creator:String,
});





// let PostSchema = new mongoose.Schema({
//   title: String,
//   postedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   comments: [{
//     text: String,
//     postedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     }
//   }]


// RequestSchema.pre(/^find/,function(next){
//   this.populate({
//     path:'availability'
//   })
//   next(); 
// })


var Request = mongoose.model("Request", RequestSchema);
module.exports = Request;
