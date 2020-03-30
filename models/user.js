var mongoose = require("mongoose");

//create a new schema/blueprint that will be save in mongodb database

var UserSchema = new mongoose.Schema({
  display_name: { type: String, required: true },
  home_city: String,
  picture: String,
  profile_type: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  tech_languages: [],
  experience: String, 
  created_at: String,
});

//create a new collection called user, it will make user plural in monogod

var User = mongoose.model("User", UserSchema);
module.exports = User;

  
//   user.save();
  