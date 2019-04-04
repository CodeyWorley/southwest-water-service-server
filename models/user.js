const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  emailAddress: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: {String, enum: ['Admin', 'Employee']},
    required: true
  }
});

UserSchema.methods.serialize = function() {
  return {
    id: this._id,
    username: this.username,
    emailAddress: this.emailAddress,
    firstName: this.firstName,
    lastName: this.lastName,
    type: this.type
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

module.exports = mongoose.model('User', UserSchema);