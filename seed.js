const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const connectDB = require("./config/db");

const doctors = [
  {
    name: "Dr. Amit Sharma",
    email: "amit.sharma@healthcare.com",
    role: "doctor",
    roleSelected: true,
    profileCompleted: true,
    specialization: "Cardiologist",
    experience: 12,
    contact: "9876543210",
    age: 45,
    address: "Mumbai, Maharashtra"
  },
  {
    name: "Dr. Neha Verma",
    email: "neha.verma@healthcare.com",
    role: "doctor",
    roleSelected: true,
    profileCompleted: true,
    specialization: "Dermatologist",
    experience: 8,
    contact: "9876543211",
    age: 38,
    address: "Delhi"
  },
  {
    name: "Dr. Rakesh Patel",
    email: "rakesh.patel@healthcare.com",
    role: "doctor",
    roleSelected: true,
    profileCompleted: true,
    specialization: "Orthopedic",
    experience: 15,
    contact: "9876543212",
    age: 50,
    address: "Ahmedabad"
  },
  {
    name: "Dr. Sneha Iyer",
    email: "sneha.iyer@healthcare.com",
    role: "doctor",
    roleSelected: true,
    profileCompleted: true,
    specialization: "Gynecologist",
    experience: 10,
    contact: "9876543213",
    age: 42,
    address: "Chennai"
  },
  {
    name: "Dr. Arjun Mehta",
    email: "arjun.mehta@healthcare.com",
    role: "doctor",
    roleSelected: true,
    profileCompleted: true,
    specialization: "Neurologist",
    experience: 14,
    contact: "9876543214",
    age: 48,
    address: "Pune"
  },
  {
    name: "Dr. Pooja Nair",
    email: "pooja.nair@healthcare.com",
    role: "doctor",
    roleSelected: true,
    profileCompleted: true,
    specialization: "Pediatrician",
    experience: 9,
    contact: "9876543215",
    age: 36,
    address: "Kochi"
  },
  {
    name: "Dr. Vikram Singh",
    email: "vikram.singh@healthcare.com",
    role: "doctor",
    roleSelected: true,
    profileCompleted: true,
    specialization: "General Physician",
    experience: 11,
    contact: "9876543216",
    age: 44,
    address: "Jaipur"
  },
  {
    name: "Dr. Kavita Rao",
    email: "kavita.rao@healthcare.com",
    role: "doctor",
    roleSelected: true,
    profileCompleted: true,
    specialization: "ENT Specialist",
    experience: 7,
    contact: "9876543217",
    age: 35,
    address: "Bangalore"
  },
  {
    name: "Dr. Mohit Khanna",
    email: "mohit.khanna@healthcare.com",
    role: "doctor",
    roleSelected: true,
    profileCompleted: true,
    specialization: "Psychiatrist",
    experience: 13,
    contact: "9876543218",
    age: 46,
    address: "Chandigarh"
  },
  {
    name: "Dr. Anjali Deshmukh",
    email: "anjali.deshmukh@healthcare.com",
    role: "doctor",
    roleSelected: true,
    profileCompleted: true,
    specialization: "Oncologist",
    experience: 16,
    contact: "9876543219",
    age: 52,
    address: "Nagpur"
  }
];

const seedDoctors = async () => {
  try {
    await connectDB();

    // Optional: remove existing doctors with same emails
    await User.deleteMany({
      email: { $in: doctors.map(d => d.email) }
    });

    await User.insertMany(doctors);

    console.log("✅ 10 Doctors seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDoctors();
