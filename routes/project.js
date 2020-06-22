var mongoose = require("mongoose");

const { router, jwt, authFunctions } = require("../index");
const { MongoClient, ObjectID } = require("mongodb");

const {
  verifyAndGetId,
  verifyAndGetIdAndOtherInfo,
} = require("../services/authFunctions.js");
var Project = require("../models/project.js");
var User = require("../models/user.js");

router.post("/create_project", (req, res) => {
  let {
    project_name,
    project_description,
    project_link,
    project_img,
    token,
  } = req.body;
  let userInfo = verifyAndGetIdAndOtherInfo(token);
  let new_project = new Project({
    user_id: userInfo.id,
    user_name: userInfo.display_name,
    project_name: project_name,
    project_description: project_description,
    project_link: project_link,
    project_img: project_img,
    rating: 0,
  });
  new_project.save().then((result) => {
    res.json({ newProject: result });
  });

  User.findOne({ _id: userInfo.id }, (err, user) => {
    if (user) {
      user.projects.push(new_project);
      user.save();
    }
  });
});

router.get("/getProjects", (req, res) => {
  let { token } = req.query;
  let secret_key = process.env.SECRET_KEY;
  let userInfo = verifyAndGetIdAndOtherInfo(token);
  var data = [];
  Project.find({
    user_name: userInfo.display_name,
  }).then((projects) => {
    if (projects) {
      res.send({ projects: projects });
    }
  });
});

router.get("/getProjectsOtherUser", (req, res) => {
  let { token, other_user_name } = req.query;
  let secret_key = process.env.SECRET_KEY;
  let userInfo = verifyAndGetIdAndOtherInfo(token);
  var data = [];
  Project.find({
    user_name: JSON.parse(other_user_name).display_name,
  }).then((projects) => {
    if (projects) {
      res.send({ projects: projects });
    }
  });
});

router.post("/rating", (req, res) => {
  let { rating, token, project_id } = req.body;
  let userInfo = verifyAndGetIdAndOtherInfo(token);
  var objectID = mongoose.Types.ObjectId(project_id);
  Project.findOneAndUpdate(
    { _id: project_id },
    { $set: { rating: rating + 1 } }
  ).catch((err) => {
    throw err;
  });
  Project.find({
    user_name: userInfo.display_name,
  }).then((projects) => {
    if (projects) {
      res.send({ projects: projects });
    }
  });
});

router.post("/rating_other_user", (req, res) => {
  let { rating, token, project_id, other_user_name } = req.body;
  let userInfo = verifyAndGetIdAndOtherInfo(token);
  var objectID = mongoose.Types.ObjectId(project_id);
  Project.findOneAndUpdate(
    { _id: project_id },
    { $set: { rating: rating + 1 } }
  ).catch((err) => {
    throw err;
  });
  Project.find({
    user_name: other_user_name.display_name,
  }).then((projects) => {
    if (projects) {
      res.send({ projects: projects });
    }
  });
});

router.post("/new_comment", (req, res) => {
  let { comments, token, project_id, index } = req.body;
  let userInfo = verifyAndGetIdAndOtherInfo(token);
  Project.findOne({ _id: project_id }).then((project) => {
    project.comments.push({
      comment_id: new ObjectID(),
      comment: comments,
      comment_by: userInfo.display_name,
    });
    project.save();
  });
  Project.find({
    user_name: userInfo.display_name,
  })
    .then((projects) => {
      if (projects) {
        projects[index].comments.push({
          comment_id: new ObjectID(),
          comment: comments,
          comment_by: userInfo.display_name,
        });
        res.json({ projects: projects });
      }
    })
    .catch((err) => res.send(err));
});

router.post("/new_comment_other_user", (req, res) => {
  let { comments, token, project_id, index, other_user_name } = req.body;
  let userInfo = verifyAndGetIdAndOtherInfo(token);
  Project.findOne({ _id: project_id }).then((project) => {
    project.comments.push({
      comment_id: new ObjectID(),
      comment: comments,
      comment_by: userInfo.display_name,
    });
    project.save();
  });
  Project.find({
    user_name: other_user_name.display_name,
  })
    .then((projects) => {
      if (projects) {
        projects[index].comments.push({
          comment_id: new ObjectID(),
          comment: comments,
          comment_by: userInfo.display_name,
        });
        res.json({ projects: projects });
      }
    })
    .catch((err) => res.send(err));
});

module.exports = router;
