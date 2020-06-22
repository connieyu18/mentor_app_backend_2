const express = require("express");
const app = express();
const cors = require("cors");
const router = express.Router();
const jwt = require("jsonwebtoken");
const server = require("http").Server(app);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv/config");
const axios = require("axios");
mongoose.set("useUnifiedTopology", true);

mongoose.connect("mongodb://localhost:27017/mentorDB", {
  useNewUrlParser: true,
});

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(cors());

app.use(bodyParser.json());

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = {
  app,
  router,
  jwt,
  axios,
};
