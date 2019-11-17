const express = require("express");
const auth = require("../../middleware/auth");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Room = require("../../models/Room");
const User = require("../../models/User");

// @route GET /api/rooms/
// @desc Get the list of all the rooms
// public

router.get("/", async (req, res) => {
  try {
    const room = await Room.find();

    if (room.length <= 0) {
      return res
        .status(400)
        .json({ msg: "Sorry! there are not any availabe rooms at the moment" });
    }
    res.json(room);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

// @route GET /api/rooms/:id
// @desc Get the room details by individual ID
// PRIVATE
router.get("/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res
        .status(400)
        .json({ msg: "sorry, we cannot find the room you entered" });
    }
    res.json(room);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

// @route POST /api/rooms/
// @desc Save the new rooms
// PRIVATE

router.post(
  "/",
  [
    auth,
    [
      check("title", "title is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      console.log(req.user.id);
      const newRoom = new Room({
        title: req.body.title,
        city: req.body.city,
        user: req.user.id,
        bedroom_no: req.body.bedroom_no,
        bathroom_no: req.body.bathroom_no
      });
      const room = await newRoom.save();

      console.log(newRoom);

      res.json(room);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);
// @route DELETE /api/rooms/:id
// @desc DELETE the room details by individual ID
// PRIVATE
router.get("/:id", auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res
        .status(400)
        .json({ msg: "sorry, we cannot find the room you entered" });
    }
    // Check user
    if (room.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    await room.remove();
    res.json("room has been deleted");
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});
module.exports = router;

// const {
//   heading,
//   street,
//   city,
//   bedroom_no,
//   bathroom_no,
//   rent,
//   secutity_deposits
// } = req.body;
// const RoomFields = {};
// RoomFields.user = req.user.id;
// if (title) RoomFields.heading = heading;
// RoomFields.address = {};

// if (street) RoomFields.address.street = street;
// if (city) RoomFields.address.city = city;
// if (bedroom_no) RoomFields.bedroom_no = bedroom_no;
// if (bathroom_no) RoomFields.bathroom_no = bathroom_no;
// if (rent) RoomFields.rent = rent;
// if (secutity_deposits) RoomFields.secutity_deposits = secutity_deposits;
