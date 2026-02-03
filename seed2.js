const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");

async function seedPatients() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected for patient seeding");

    // 🔍 Find any one doctor
    const doctor = await User.findOne({ role: "doctor" });

    if (!doctor) {
      console.log("❌ No doctor found. Seed doctors first.");
      process.exit(1);
    }

    // ❌ Remove old fake patients (optional)
    await User.deleteMany({
      role: "patient",
      email: { $regex: "@fakepatient.com" }
    });

    const patients = [
      {
        name: "Rahul Mehta",
        email: "rahul@fakepatient.com",
        contact: "9000011111",
        age: 30,
        medicalConditions: ["BP"],
      },
      {
        name: "Sneha Kulkarni",
        email: "sneha@fakepatient.com",
        contact: "9000022222",
        age: 25,
        medicalConditions: ["Asthma"],
      },
      {
        name: "Amit Joshi",
        email: "amit@fakepatient.com",
        contact: "9000033333",
        age: 40,
        medicalConditions: ["Diabetes"],
      },
      {
        name: "Pooja Sharma",
        email: "pooja@fakepatient.com",
        contact: "9000044444",
        age: 35,
        medicalConditions: [],
      },
      {
        name: "Vikas Patil",
        email: "vikas@fakepatient.com",
        contact: "9000055555",
        age: 50,
        medicalConditions: ["Arthritis"],
      }
    ];

    const insertedPatients = [];

    for (let p of patients) {
      const patient = await User.create({
        ...p,
        role: "patient",
        doctorId: doctor._id,
        profileCompleted: true
      });

      insertedPatients.push(patient._id);
    }

    // 👨‍⚕️ Add patients to doctor's list
    await User.findByIdAndUpdate(doctor._id, {
      $addToSet: { patients: { $each: insertedPatients } }
    });

    console.log("✅ 5 fake patients added and assigned to doctor");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding patients:", err);
    process.exit(1);
  }
}

seedPatients();
