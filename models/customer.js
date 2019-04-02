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
    authorizedUsers: {
      // {name, relation}
      type: Array
    },
    address: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Address' 
      }
    ],
    companyName: {
      type: String
    },
    homePhone: {
      type: String,
      unique: true
    },
    cellPhone: {
      type: String,
      unique: true
    },
    businessPhone: {
      type: String,
      unique: true
    },
    emailAddress: {
      type: String,
      required: true,
      unique: true
    },
    // products: [
    //   { 
    //     type: mongoose.Schema.Types.ObjectId, 
    //     ref: 'Product' 
    //   }
    // ],
    services: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Service' 
      }
    ],
    contracts: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Contract' 
      }
    ],
    notes: {
      // {date, information}
      type: Array
    },
    instructions: {
      type: String
    },
    // add an automated email / mail card Boolean field here
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
