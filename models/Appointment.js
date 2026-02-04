const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    cancelledBy: {
  type: String,
  enum: ["doctor", "patient"],
  default:null
},

    reason: {
      type: String
    },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled","completed"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);
