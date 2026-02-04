const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    role: {
  type: String,
  enum: ["doctor", "patient"],
  default: "patient",   // safe default
  required: true
},

roleSelected: {
  type: Boolean,
  default: false        // 👈 THIS IS THE KEY
},


    name: String,
    contact: String,
    age: Number,
    address: String,
    // Doctor profile fields
degree: String,
experience: Number, // years
about: String,
clinicAddress: String,

// Patient profile fields
address: String,
emergencyContact: String,
bloodGroup: String,


    profilePhoto: {
      type: String,
      default: ""
    },

    // 👤 Patient-only fields
    medicalConditions: {
      type: [String],
      default: []
    },

    // ✅ MULTIPLE DOCTORS PER PATIENT
    doctors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
      }
    ],

    // ⏳ Patient → doctor requests
    pendingDoctorRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
      }
    ],

    // 👨‍⚕️ Doctor-only fields
    specialization: String,

    // ⏳ Doctor → patient requests
    pendingPatients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
      }
    ],

    // 👨‍⚕️ Approved patients
    patients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
      }
    ],

    profileCompleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
