const express = require("express");
const app = express();
const cors = require("cors");
const router = express.Router();
const jwt = require("jsonwebtoken");
const server = require("http").Server(app);
const bodyParser = require("body-parser");//body-parser helps to parse the request and create the req.body object
const mongoose = require("mongoose");
require('dotenv/config');
const axios = require("axios");
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost:27017/mentorDB", {
  useNewUrlParser: true
});

app.use(
  express.urlencoded({
    extended: true
  })// parse requests of content-type - application/x-www-form-urlencoded

);
app.use(express.json());
app.use(cors());


app.use(bodyParser.json());// parse requests of content-type - application/json


const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = {
  app,
  router,
  jwt,
  axios
  // io
};
