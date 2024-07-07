// import express
const express = require("express");
const app = express();

// define root route
app.get("/", (req, res) => {
  res.send("hello from yelp camp!");
});

// start server on port 3000
app.listen(3000, () => {
  console.log("serving from port 3000");
});
