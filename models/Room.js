const mongoose = require("mongoose");
const StateArray = ["NSW", "ACT", "VIC", "SA", "QLD", "TSM"];
const RoomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: { ENUM: StateArray },
    zip: Number
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  description: {
    type: String
  },
  bedroom_no: {
    type: Number,
    required: true
  },
  bathroom_no: {
    type: Number,
    required: true
  },
  rent: {
    type: Number
  },

  secutity_depos: {
    type: Number
  },
  Room_Furnising: {
    type: { ENUM: [("furnished", "unfurnished", "semifurnished")] }
  },
  Available_on: {
    type: Date
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  },
  uid: {
    type: Number
  },

  phone_number: {
    type: Number
  },
  photos: {
    type: Buffer
  }
});

module.exports = User = mongoose.model("Room", RoomSchema);
