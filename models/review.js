// import mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// define review schema
const ReviewSchema = new Schema({
  body: String,
  rating: Number,
});

// export review model
module.exports = mongoose.model("Review", ReviewSchema);
