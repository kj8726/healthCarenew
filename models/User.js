const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    // 🔐 Auth / Identity
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
      default: "patient",
      required: true
    },

    roleSelected: {
      type: Boolean,
      default: false
    },

    // 👤 Basic Profile
    name: String,
    contact: String,
    age: Number,
    address: String,

    profilePhoto: {
      type: String,
      default: ""
    },

    // =========================
    // 🧑‍⚕️ DOCTOR PROFILE
    // =========================

    degree: String,
    specialization: String,
    experience: Number, // years
    about: String,
    clinicAddress: String,

    // Doctor → patient workflow
    pendingPatients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
      }
    ],

    patients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
      }
    ],

    // =========================
    // 🧑‍🦽 PATIENT PROFILE
    // =========================

    emergencyContact: String,
    bloodGroup: String,

    medicalConditions: {
      type: [String],
      default: []
    },

    // Additional health data
    height: Number,
    weight: Number,
    allergies: String,
    currentMedications: String,
    surgeryHistory: String,
    familyHistory: String,

    // Patient → doctor workflow
    doctors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
      }
    ],

    pendingDoctorRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
      }
    ],

    // =========================
    // ✅ SYSTEM FLAGS
    // =========================

    profileCompleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
