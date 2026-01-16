const express = require("express");
const Donor = require("../models/Donor");

const router = express.Router();

const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
  try {
    const {
      fullName,
      emailAddress,
      password,
      dateOfBirth,
      bloodType,
      consent
    } = req.body;
    // 📧 Email validation (allow only common providers)
    const allowedEmailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/;

    if (!allowedEmailRegex.test(emailAddress)) {
      return res.status(400).json({
        message: "Please enter a valid email (gmail, yahoo, outlook only)"
      });
    }


    // 🔞 Age check (18+)
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;

    if (age < 18) {
      return res.status(400).json({
        message: "You must be at least 18 years old to register"
      });
    }

    // 🔍 Check if user already exists
    const existingUser = await Donor.findOne({ email: emailAddress });

    // 🔐 LOGIN FLOW
    if (existingUser) {
      const isMatch = await bcrypt.compare(password, existingUser.password);

      if (!isMatch) {
        return res.status(401).json({
          message: "Wrong password. Try again."
        });
      }

      return res.status(200).json({ message: "Login successful" });

    }

    // 🆕 REGISTER FLOW
    const hashedPassword = await bcrypt.hash(password, 10);

    const donor = new Donor({
      fullName,
      email: emailAddress,
      password: hashedPassword,
      dob,
      bloodType,
      consent
    });

    await donor.save();

    res.status(200).json({ message: "Registration successful" });


  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Save donor extra details (next page)
router.post("/details", async (req, res) => {
  try {
    const { email, organs, contactNumber } = req.body;

    const donor = await Donor.findOne({ email });

    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    donor.organs = organs;
    donor.contactNumber = contactNumber;
    donor.status = "pending";

    await donor.save();

    res.json({ message: "Donor details saved successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// 🔑 RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const donor = await Donor.findOne({ email });

    if (!donor) {
      return res.status(404).json({ message: "Email not registered" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    donor.password = hashed;
    await donor.save();

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
