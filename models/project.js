var mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const User=require("./user").schema;
var User = require("../models/user.js");

var ProjectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  user_id: { type: String, required: true },
  user_name: { type: String, required: true },
  project_name: { type: String, required: true },
  project_description: { type: String, required: true },
  project_link: { type: String},
  project_img: { type: String },
  comments: [
    {
      comment_id:{
        type:String
      },
      comment_by: {
        type: String
      },
      comment: { type: String },
      comment_createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  rating: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

var Project = mongoose.model("Project", ProjectSchema);
module.exports = Project;
