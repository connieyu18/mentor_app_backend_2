const {
  router,
} = require("../index");

router.post("/signup", (req, res) => {
  console.log("this is sign up");

  res.json({ msg: "this is a message" });

  // either end the response or send response
  // res.send() or res.json() to send data back to the requester
  // or res.end() and send nothing, but instead end the response, but this is rare
});

module.exports = router;
