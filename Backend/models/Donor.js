const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
  fullName: String,

  email: { 
    type: String, 
    unique: true, 
    required: true 
  },

  password: String,

  dob: Date,

  bloodType: String,

  consent: Boolean,

  organs: [String],

  contactNumber: {
    type: String
  },

  status: {
    type: String,
    default: "pending"
  }
});

module.exports = mongoose.model("Donor", donorSchema);
