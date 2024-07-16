const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const joi = require("joi");

const Campground = require("./models/campground");
const Review = require("./models/review");

const handleAsync = require("./utilities/handleAsync");
const ExpressError = require("./utilities/ExpressError");

// connect to mongodb
mongoose.connect("mongodb://localhost:27017/yelp-camp", {});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("database connected");
});

const app = express();

app.engine("ejs", ejsMate);

// set view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// define root route
app.get("/", (req, res) => {
  res.render("index");
});

// define campgrounds route
app.get(
  "/campgrounds",
  handleAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

// form for creating new campground
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// handle new campground submission
app.post(
  "/campgrounds",
  handleAsync(async (req, res, next) => {
    // if (!req.body.campground)
    //   throw new ExpressError("Invalid Campground Data", 400);
    const campgroundSchema = joi.object({
      campground: joi
        .object({
          title: joi.string().required(),
          image: joi.string().required(),
          price: joi.number().min(0).required(),
          description: joi.string().required(),
          location: joi.string().required(),
        })
        .required(),
    });

    const { error } = campgroundSchema.validate(req.body);
    if (error) {
      const message = error.details.map((el) => el.message).join(",");
      throw new ExpressError(message, 400);
    }

    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// define show route for displaying campground details
app.get(
  "/campgrounds/:id",
  handleAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
  })
);

// form for editing a campground
app.get(
  "/campgrounds/:id/edit",
  handleAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

// handle campground edit submission
app.put(
  "/campgrounds/:id",
  handleAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// route to handle deletion of a campground
app.delete(
  "/campgrounds/:id",
  handleAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

// handle new review submission
app.post(
  "/campgrounds/:id/reviews",
  handleAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// catch-all route for undefined routes
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error", { err });
});

// start server on port 3000
app.listen(3000, () => {
  console.log("serving from port 3000");
});
