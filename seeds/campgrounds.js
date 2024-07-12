// import mongoose
const mongoose = require("mongoose");

const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

// connect to mongodb
mongoose.connect("mongodb://localhost:27017/yelp-camp", {});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("database connected");
});

// utility function: returns a random element from an array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

// populates database with campgrounds
const seedDB = async () => {
  await Campground.deleteMany({});

  for (let i = 0; i < 50; i++) {
    const random = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;

    const camp = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random].city}, ${cities[random].state}`,
      image: `https://picsum.photos/400?random=${Math.random()}`,
      description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet consequatur nam neque deserunt optio accusamus veritatis aliquid expedita, obcaecati repellendus nihil, et maiores eveniet quis dolore itaque commodi officia. Fugit.`,
      price,
    });
    await camp.save();
  }
};

// execute seed function and close mongodb connection
seedDB().then(() => {
  mongoose.connection.close();
});
