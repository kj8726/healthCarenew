const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connected for seeding");
};

const doctors = [
  {
    name: "Dr. Amit Sharma",
    email: "amit.sharma@hospital.com",
    role: "doctor",
    specialization: "Cardiologist",
    degree: "MD (Cardiology)",
    experience: 12,
    clinicAddress: "Apollo Hospital, Mumbai",
    profileCompleted: true
  },
  {
    name: "Dr. Neha Verma",
    email: "neha.verma@hospital.com",
    role: "doctor",
    specialization: "Dermatologist",
    degree: "MD (Dermatology)",
    experience: 8,
    clinicAddress: "SkinCare Clinic, Pune",
    profileCompleted: true
  },
  {
    name: "Dr. Rahul Mehta",
    email: "rahul.mehta@hospital.com",
    role: "doctor",
    specialization: "Orthopedic",
    degree: "MS (Orthopedics)",
    experience: 15,
    clinicAddress: "City Hospital, Ahmedabad",
    profileCompleted: true
  },
  {
    name: "Dr. Pooja Kulkarni",
    email: "pooja.kulkarni@hospital.com",
    role: "doctor",
    specialization: "Gynecologist",
    degree: "MD (Gynecology)",
    experience: 10,
    clinicAddress: "Mother Care Hospital, Nagpur",
    profileCompleted: true
  },
  {
    name: "Dr. Sandeep Joshi",
    email: "sandeep.joshi@hospital.com",
    role: "doctor",
    specialization: "Neurologist",
    degree: "DM (Neurology)",
    experience: 18,
    clinicAddress: "Neuro Center, Delhi",
    profileCompleted: true
  },
  {
    name: "Dr. Anjali Deshpande",
    email: "anjali.deshpande@hospital.com",
    role: "doctor",
    specialization: "Pediatrician",
    degree: "MD (Pediatrics)",
    experience: 9,
    clinicAddress: "ChildCare Clinic, Nashik",
    profileCompleted: true
  },
  {
    name: "Dr. Vikram Singh",
    email: "vikram.singh@hospital.com",
    role: "doctor",
    specialization: "General Physician",
    degree: "MBBS",
    experience: 14,
    clinicAddress: "HealthPlus Clinic, Jaipur",
    profileCompleted: true
  },
  {
    name: "Dr. Kavita Rao",
    email: "kavita.rao@hospital.com",
    role: "doctor",
    specialization: "ENT Specialist",
    degree: "MS (ENT)",
    experience: 11,
    clinicAddress: "ENT Care Center, Hyderabad",
    profileCompleted: true
  },
  {
    name: "Dr. Arjun Patel",
    email: "arjun.patel@hospital.com",
    role: "doctor",
    specialization: "Urologist",
    degree: "MS (Urology)",
    experience: 16,
    clinicAddress: "LifeLine Hospital, Surat",
    profileCompleted: true
  },
  {
    name: "Dr. Ritu Malhotra",
    email: "ritu.malhotra@hospital.com",
    role: "doctor",
    specialization: "Psychiatrist",
    degree: "MD (Psychiatry)",
    experience: 13,
    clinicAddress: "MindCare Clinic, Chandigarh",
    profileCompleted: true
  }
];

const seedDoctors = async () => {
  try {
    await connectDB();

    for (const doc of doctors) {
      const exists = await User.findOne({ email: doc.email });
      if (!exists) {
        await User.create(doc);
        console.log(`✅ Added ${doc.name}`);
      } else {
        console.log(`⚠️ Skipped ${doc.name} (already exists)`);
      }
    }

    console.log("🎉 Doctor seeding completed");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seedDoctors();
