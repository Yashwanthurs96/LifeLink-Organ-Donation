const express = require("express");
const Donor = require("../models/Donor");

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const {
            fullName,
            emailAddress,
            dateOfBirth,
            bloodType,
            consent
        } = req.body;

        if (!consent) {
            return res.status(400).json({ message: "Consent required" });
        }

        const existing = await Donor.findOne({ email: emailAddress });
        if (existing) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const donor = new Donor({
            fullName,
            email: emailAddress,
            dob: dateOfBirth,
            bloodType,
            consent
        });

        await donor.save();
        res.status(201).json({ message: "Registration successful" });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
