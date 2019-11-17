const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  password_token: {},
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  },
  confimation_status: {
    type: Boolean
  },
  phone_number: {
    type: Number,
    required: true
  }
});

module.exports = User = mongoose.model("user", UserSchema);
