const express = require("express");
const auth = require("../../middleware/auth");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route POST /api/profile/me
// @desc Get the Profile of Logged in User

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user"
    );

    if (!profile) {
      return res.status(400).json({ msg: "the user profile is not set up" });
    }
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

// @route POST /api/profile/
// @desc Get the Profile of all users

router.get("/", async (req, res) => {
  try {
    const profile = await Profile.find().populate("user", [
      "name",
      "email",
      "phoneno"
    ]);

    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

// @route POST /api/profile/user/:userid
// @desc Get the Profile of user by userid

router.get("/user/:userid", async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userid }).populate(
      "user",
      ["name", "email", "phoneno"]
    );

    if (!profile) {
      return res
        .status(400)
        .json({ msg: "There has been no profile for this user" });
    }

    return res.json(profile);
  } catch (err) {
    if (err == kind("ObjectId")) {
      return res
        .status(400)
        .json({ msg: "There has been no profile for this user" });
    }
    console.log(err.message);
    res.status(500).send("server error");
  }
});

// @route POST /api/profile/
// @desc Post the Profile of authenticated user
router.post("/", auth, async (req, res) => {
  const { gender, address, street, postcode, city } = req.body;

  const profileFields = {};
  profileFields.user = req.user.id;
  if (gender) profileFields.gender = gender;
  profileFields.address = {};

  if (street) profileFields.address.street = street;
  if (postcode) profileFields.address.postcode = postcode;
  if (city) profileFields.address.city = city;
  // updated_at: Math.floor(Date.now() / 1000)
  try {
    let profile = await Profile.findOne({ user: req.user.id });

    console.log(profileFields);
    //update if exist
    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }
    // create new profile
    profile = new Profile(profileFields);
    await profile.save();
    return res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

// @route DELETE /api/profile/
// @desc Delete the Profile of authenticated user
router.delete("/", auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await Profile.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "User and Related Content Deleted Sucessfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});
module.exports = router;
