const mongoose = require("mongoose");

const ServiceSchema = mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: true
  },
  type: {
    type: {String, enum: ['Service', 'Salt', 'Misc']},
    required: true
  },
  description: {
    type: String,
    unique: true
  }
});

ServiceSchema.set("timestamps", true);
ServiceSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, result) => {
    delete result.__v;
    delete result._id;
  }
});

module.exports = mongoose.model("Service", ServiceSchema);