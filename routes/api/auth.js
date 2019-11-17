const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");
// @route POST /api/auth
// @desc Get the signed user
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

// @route POST /api/auth
// @desc Authenticate the user
router.post(
  "/",
  [
    check("email", "Please include a Valid Email").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email }).exec();

      if (!user) {
        return res.status(400).json({ errors: [{ msg: "Invalid email" }] });
      }

      const isMatch = await bcrypt.compareSync(password, user.password);
      console.log(isMatch);
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: "Invalid password" }] });
      }

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
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);

module.exports = router;
