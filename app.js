const {
  app,
} = require("./index");

app.use("/auth", require("./routes/auth"));
app.use("/profile", require("./routes/profile"));
app.use("/search", require("./routes/search"));
app.use("/availability", require("./routes/availability"));
app.use("/request", require("./routes/request"));