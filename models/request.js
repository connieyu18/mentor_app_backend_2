var mongoose = require('mongoose')

const RequestSchema = new mongoose.Schema({
  sender_id: String,
  recipient_id: String,
  requested_date: String,
  requested_time: String,
});

var Request = mongoose.model('Request', RequestSchema);
module.exports = Request;
