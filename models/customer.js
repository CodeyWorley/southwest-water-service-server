const mongoose = require("mongoose");

const CustomerSchema = mongoose.Schema({
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    authorizedUsers: {
      // {name, relation}
      type: Array
    },
    companyName: {
      type: String
    },
    phoneNumbers: {
      // {type, number, info}
      type: Array,
      required: true
    },
    emailAddress: {
      type: String,
      required: true,
      // unique: true
    },
    notes: {
      // {date, information}
      type: Array
    },
    instructions: {
      type: String
    },
    status: {
      type: {String, enum: ['Active', 'Inactive']},
      required: true
    },
    // mailingList: {
    //   type: Boolean,
    //   required: true
    // },
    // emailingList: {
    //   type: Boolean,
    //   required: true
    // }
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
