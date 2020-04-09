const { router, jwt, authFunctions } = require("../index");
const { MongoClient, ObjectID } = require("mongodb");
var mongoose = require("mongoose");

var Project = require("../models/project.js");

const {
  verifyAndGetId,
  verifyAndGetIdAndOtherInfo,
} = require("../services/authFunctions.js");
var User = require("../models/user.js");

router.post("/create_project", (req, res) => {
  console.log("FFFFFF");
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
  });
  new_project.save().then((res) => {
    console.log("INFFF");
    User.findOne({ _id: userInfo.id }, (err, user) => {
      if (user) {
        user.projects.push(new_project);
        user.save();
        // res.json({new_project:res})
        console.log("FFF");
      }
    });
  });
});

router.post("/rating", (req, res) => {
  console.log("FFHHF" + req.body.rating);
  let { rating, token, project_id } = req.body;
  console.log("THIS IS OPR" + project_id);
  let userInfo = verifyAndGetIdAndOtherInfo(token);
  // User.updateOne(
  //   { _id: userInfo.id, "projects.projects._id": project_id },
  //   { $set: { "projects.projects._id.rating": rating } }
  // ).then((res) => console.log(res));
  Project.findOneAndUpdate(
    { _id: project_id },
    { $set: { rating: rating } },
    { returnOriginal: false },
    function (err, doc) {
      res.send({ rating: doc.rating });
      console.log("rSss" + doc);
      var objectId = mongoose.Types.ObjectId(project_id);
      User.findById(
        { "projects._id": project_id }).then(res=>console.log(res))
        }
      ).catch(err=>{throw err});
});

module.exports = router;
