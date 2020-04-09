var mongoose = require("mongoose");

var ProjectSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  user_name: { type: String, required: true },
  project_name: { type: String, required: true },
  project_description: { type: String, required: true },
  project_link: { type: String, required: true },
  project_img: { type: String },
  comments: [
    {
      comment_by: {
        type: String,
        required: [true, "Review must be written by a user"],
      },
      comment: { type: String, required: true },
      comment_createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

var Project = mongoose.model("Project", ProjectSchema);
module.exports = Project;
