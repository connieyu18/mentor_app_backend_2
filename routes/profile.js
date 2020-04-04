const { router, jwt, authFunctions } = require("../index");
const { verifyAndGetId } = require("../services/authFunctions.js");
var User = require("../models/user.js");

router.get("/getUserProfile", (req, res)=> {
  let {token} = req.query;
  let secret_key = process.env.SECRET_KEY;
  let id = verifyAndGetId(token);
  User
    .findOne({ _id:id})
    .then(user =>{
      if(user){
        res.json({user});
      } else {
        res.json({ error: "Invalid token" });
      }
    })
});

router.get("/getOtherUserProfile", (req, res)=> {
    let {_id} = req.query;
    User
      .findOne({ _id:_id})
      .then(user =>{
        if(user){
          res.json({user});
        } else {
          res.json({ error: "Invalid token" });
        }
      })
  });
module.exports = router;