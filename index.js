const express = require("express");
const app = express();
const cors = require("cors");
const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const server = require('http').Server(app);

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server started on port ${port}`)
});

module.exports = {
  app,
  router,
  // jwt,
  // io
};