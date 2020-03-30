var mongoose = require('mongoose')

const AvailabilitySchema = new mongoose.Schema({
    m_id: String,
    t_id: String,
    method: String,
    date_start: String,
    date_end: String,
    time_start: String,
    time_end: String,
    name: String,
    m_email: String,
    t_email: String,
    denied: [],
    confirmed: String,
    pending: []
  });

var Availability = mongoose.model('Availability', AvailabilitySchema);
module.exports = Availability;
