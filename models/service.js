const mongoose = require("mongoose");

const ServiceSchema = mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true
    },
    price: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true,
      unique: true
    }
  });

ServiceSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, result) => {
    delete result.__v;
    delete result._id;
  }
});

module.exports = mongoose.model("Service", ServiceSchema);