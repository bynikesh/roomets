const express = require("express");

const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");
// @route POST /api/users
// @desc Register User
router.post(
  "/",
  [
    check("name", "name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a Valid Email").isEmail(),
    check("password", "Please enter a password more than 6 character").isLength(
      { min: 6 }
    ),
    check("phone_number", "Please enter a valid phone number").isLength({
      min: 10
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(500).json({
        errors: errors.array()
      });
    }
    const { name, email, password, phone_number } = req.body;

    try {
      let user = await User.findOne({ email });
      console.log(user);
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "The User email Already exists" }] });
      }
      user = new User({
        name,
        email,
        password,
        phone_number
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);
      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("JWTSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

      //res.send("user registered");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);

module.exports = router;
