const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    dob: {
        type: Date,
        required: true
    },
    bloodType: {
        type: String,
        required: true
    },
    consent: {
        type: Boolean,
        required: true
    },
    consentDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Donor", donorSchema);
