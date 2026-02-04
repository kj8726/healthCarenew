const mongoose = require("mongoose");

const MedicalHistorySchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

      doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    
    doctorName: {
      type: String,
      required: true
    },
    
    doctorEmail: {
      type: String
    },
    
    doctorDeleted: {
      type: Boolean,
      default: false
    },


    advice: {
      type: String,
      required: true
    },

    medicines: {
      type: [String],
      default: []
    },

    notes: String
  },
  { timestamps: true } // createdAt = visit date
);

module.exports = mongoose.model("MedicalHistory", MedicalHistorySchema);
