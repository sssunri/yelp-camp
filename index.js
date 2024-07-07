// import express and path
const express = require("express");
const app = express();
const path = require("path");

// set view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// define root route
app.get("/", (req, res) => {
  res.render("index");
});

// start server on port 3000
app.listen(3000, () => {
  console.log("serving from port 3000");
});
