const mongoose = require("mongoose");

const AddressSchema = mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Customer', 
        required: true
    },
    address: {
      type: String,
      required: true,
      unique: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    community: {
      type: String
    },
    notes: {
      type: Array
    },
    isBilling: {
      type: Boolean,
      required: true
    }
  });

AddressSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, result) => {
    delete result.__v;
    delete result._id;
  }
});

module.exports = mongoose.model("Address", AddressSchema);
