// import mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// define campground schema
const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// export campground model
module.exports = mongoose.model("Campground", CampgroundSchema);
