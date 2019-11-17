const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  name: {
    firstname: String,
    lastname: String
  },
  gender: {
    type: { Enum: ["male", "female"] }
  },
  age: { type: Number },
  address: {
    street: String,
    city: String,
    postcode: Number
  },
  noofpeople: { type: Number },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  },
  profilePic: {
    type: Buffer
  }
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
