var mongoose = require('mongoose')


const RequestSchema = new mongoose.Schema({
    person_id:String, 
    other_person_id:String,
    requested_date: String,
    requested_time: String,
    other_person_email: String,
})

var Request = mongoose.model('Request', RequestSchema);
module.exports = Request;
