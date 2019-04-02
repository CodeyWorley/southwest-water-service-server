const mongoose = require("mongoose");

const ServiceSchema = mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: true
  },
  type: {
    type: {String, enum: ['Installation', 'Service', 'Misc', 'Quote']},
    required: true
  },
  price: {
    type: String
  },
  description: {
    type: String
  },
  dateScheduled: {
    type: String,
    required: true
  },
  timeScheduled: {
    type: String,
    required: true
  },
  status: {
    type: {String, enum: ['Done', 'Working on Job', 'Cancelled', 'Rescheduled', 'Waiting for Customer', 'On Schedule', 'Running Late']},
    required: true,
  },
  technicianId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
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