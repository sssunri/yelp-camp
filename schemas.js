const joi = require("joi");

module.exports.campgroundSchema = joi.object({
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
