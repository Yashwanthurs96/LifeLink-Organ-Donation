const express = require("express");
const Donor = require("../models/Donor");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    console.log(req.body); // helps debug

    const { fullName, emailAddress, dateOfBirth, bloodType, consent } = req.body;

    if (!fullName || !emailAddress || !dateOfBirth || !bloodType) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const donor = new Donor({
      fullName,
      email: emailAddress,
      dob: dateOfBirth,
      bloodType,
      consent
    });

    await donor.save();

    res.json({ message: "Registration successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
