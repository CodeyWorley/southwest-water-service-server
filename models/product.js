const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: {String, enum: ['Reverse Osmosis', 'Water Softener', 'Water Heater', 'Sink', 'Garbage Disposal']},
    required: true
  },
  price: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

ProductSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, result) => {
    delete result.__v;
    delete result._id;
  }
});

module.exports = mongoose.model("Product", ProductSchema);
