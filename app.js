const {
  app,
} = require("./index");

app.use("/auth", require("./routes/auth"));
