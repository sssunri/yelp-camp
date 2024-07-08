// import express, path and mongoose
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const Campground = require("./models/campground");

// connect to mongodb
mongoose.connect("mongodb://localhost:27017/yelp-camp", {});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("database connected");
});

const app = express();

// set view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// define root route
app.get("/", (req, res) => {
  res.render("index");
});

// define campgrounds route
app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

// start server on port 3000
app.listen(3000, () => {
  console.log("serving from port 3000");
});
