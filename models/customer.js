const mongoose = require("mongoose");

const CustomerSchema = mongoose.Schema({
    firstName: {
      type: String,
      required: true,
      unique: true
    },
    lastName: {
      type: String,
      required: true,
      unique: true
    },
    address: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    jobs: {
      type: Array
    },
  });

CustomerSchema.set("timestamps", true);
CustomerSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, result) => {
    delete result.__v;
    delete result._id;
  }
});

module.exports = mongoose.model("Customer", CustomerSchema);
