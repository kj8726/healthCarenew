const router = require("express").Router();
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const MedicalHistory = require("../models/MedicalHistory");



// 🔒 Login check
const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
};

// 📊 Dashboard
router.get("/dashboard", ensureAuth, async (req, res) => {
  const user = await User.findById(req.user.id);

  // 👨‍⚕️ Doctor Dashboard
  if (user.role === "doctor") {
  const doctor = await User.findById(user._id)
  .populate("patients")
  .populate("pendingPatients");

const patients = doctor.patients;


  const appointments = await Appointment.find({
    doctorId: user._id
  }).populate("patientId");

  return res.render("doctor-dashboard", {
    doctor: user,
    patients,
    appointments
  });
}


  // 👤 Patient Dashboard
  // 👤 Patient Dashboard
if (user.role === "patient") {
  const patient = await User.findById(req.user._id)
    .populate("doctors")
    .populate("pendingDoctorRequests");

  const doctors = await User.find({ role: "doctor" });

  const appointments = await Appointment.find({
    patientId: patient._id
  }).populate("doctorId");

    const history = await MedicalHistory.find({
    patientId: patient._id
  })
    .populate("doctorId")
    .sort({ createdAt: -1 });

  // 🔒 SAFETY NET (IMPORTANT)
  patient.doctors = patient.doctors || [];
  patient.pendingDoctorRequests = patient.pendingDoctorRequests || [];

  return res.render("patient-dashboard", {
    patient,
    doctors,
    appointments,
    history
  });
}
  res.redirect("/");
});




router.get("/doctor/patient/:id", ensureAuth, async (req, res) => {
  if (req.user.role !== "doctor") return res.redirect("/dashboard");

  const doctorId = req.user._id;
  const patientId = req.params.id;

  // 🔒 Ensure patient belongs to this doctor
  const doctor = await User.findById(doctorId);
  if (!doctor.patients.includes(patientId)) {
    return res.redirect("/dashboard");
  }

  const patient = await User.findById(patientId);

  const history = await MedicalHistory.find({ patientId })
    .populate("doctorId")
    .sort({ createdAt: -1 });

  res.render("doctor-patient", {
    patient,
    history,
    doctorId: req.user._id
  });
});


router.post("/assign-doctor", ensureAuth, async (req, res) => {
  const doctorId = req.body.doctorId;
  const patientId = req.user.id;

  // Assign doctor to patient
  await User.findByIdAndUpdate(patientId, {
    doctorId: doctorId
  });

  // Add patient to doctor's list
  await User.findByIdAndUpdate(doctorId, {
    $addToSet: { patients: patientId }
  });

  res.redirect("/dashboard");
});

router.post("/book-appointment", ensureAuth, async (req, res) => {
  const { doctorId, date, time, reason } = req.body;

  await Appointment.create({
    patientId: req.user.id,
    doctorId,
    date,
    time,
    reason
  });

  res.redirect("/dashboard");
});

router.post("/change-doctor", ensureAuth, async (req, res) => {
  const newDoctorId = req.body.doctorId;
  const patientId = req.user.id;

  const patient = await User.findById(patientId);

  // Remove patient from old doctor's list
  if (patient.doctorId) {
    await User.findByIdAndUpdate(patient.doctorId, {
      $pull: { patients: patientId }
    });
  }

  // Assign new doctor to patient
  await User.findByIdAndUpdate(patientId, {
    doctorId: newDoctorId
  });

  // Add patient to new doctor's list
  await User.findByIdAndUpdate(newDoctorId, {
    $addToSet: { patients: patientId }
  });

  res.redirect("/dashboard");
});


router.post("/doctor/add-patient", ensureAuth, async (req, res) => {
  if (req.user.role !== "doctor") {
    return res.redirect("/dashboard");
  }

  const { name, email, age, contact, medicalConditions } = req.body;

  let patient = await User.findOne({ email });

  if (!patient) {
    patient = await User.create({
      name,
      email,
      age,
      contact,
      role: "patient",
      medicalConditions: medicalConditions
        ? medicalConditions.split(",")
        : [],
      doctorId: req.user._id,
      profileCompleted: true
    });
  } else {
    await User.findByIdAndUpdate(patient._id, {
      doctorId: req.user._id
    });
  }

  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { patients: patient._id }
  });

  res.redirect("/dashboard");
});

router.post("/doctor/remove-patient", ensureAuth, async (req, res) => {
  if (req.user.role !== "doctor") return res.redirect("/dashboard");

  const { patientId } = req.body;
  const doctorId = req.user._id;

  // 1️⃣ Remove patient from doctor's list
  await User.findByIdAndUpdate(doctorId, {
    $pull: { patients: patientId }
  });

  // 2️⃣ Remove doctor from patient's list
  await User.findByIdAndUpdate(patientId, {
    $pull: { doctors: doctorId }
  });
  console.log("Doctor:", doctorId, "Patient removed:", patientId);


  // 3️⃣ Optional: also remove pending links if any
  await User.findByIdAndUpdate(doctorId, {
    $pull: { pendingPatients: patientId }
  });

  await User.findByIdAndUpdate(patientId, {
    $pull: { pendingDoctorRequests: doctorId }
  });

  res.redirect("/dashboard");
});



router.post("/patient/request-doctor", ensureAuth, async (req, res) => {
  if (req.user.role !== "patient") return res.redirect("/dashboard");

  const { doctorId } = req.body;

  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { pendingDoctorRequests: doctorId }
  });

  await User.findByIdAndUpdate(doctorId, {
    $addToSet: { pendingPatients: req.user._id }
  });

  res.redirect("/dashboard");
});

router.post("/doctor/approve-patient", ensureAuth, async (req, res) => {
  const { patientId } = req.body;

  await User.findByIdAndUpdate(patientId, {
    $addToSet: { doctors: req.user._id },
    $pull: { pendingDoctorRequests: req.user._id }
  });

  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { patients: patientId },
    $pull: { pendingPatients: patientId }
  });

  res.redirect("/dashboard");
});


router.post("/doctor/reject-patient", ensureAuth, async (req, res) => {
  const { patientId } = req.body;

  await User.findByIdAndUpdate(patientId, {
    $pull: { pendingDoctorRequests: req.user._id }
  });

  await User.findByIdAndUpdate(req.user._id, {
    $pull: { pendingPatients: patientId }
  });

  res.redirect("/dashboard");
});


router.post("/patient/remove-doctor", ensureAuth, async (req, res) => {
  const { doctorId } = req.body;

  await User.findByIdAndUpdate(req.user._id, {
    $pull: { doctors: doctorId }
  });

  await User.findByIdAndUpdate(doctorId, {
    $pull: { patients: req.user._id }
  });

  res.redirect("/dashboard");
});



router.post("/patient/cancel-appointment", ensureAuth, async (req, res) => {
  const { appointmentId } = req.body;

  await Appointment.findByIdAndDelete(appointmentId);
  res.redirect("/dashboard");
});

router.post("/doctor/add-history", ensureAuth, async (req, res) => {
  if (req.user.role !== "doctor") return res.redirect("/dashboard");

  const { patientId, advice, medicines, notes } = req.body;

  await MedicalHistory.create({
    patientId,
    doctorId: req.user._id,
    advice,
    medicines: medicines ? medicines.split(",") : [],
    notes
  });

  res.redirect("/dashboard");
});

router.get("/doctor/edit-history/:id", ensureAuth, async (req, res) => {
  if (req.user.role !== "doctor") return res.redirect("/dashboard");

  const record = await MedicalHistory.findById(req.params.id);

  // 🔒 Security: only creator doctor can edit
  if (!record || record.doctorId.toString() !== req.user._id.toString()) {
    return res.redirect("/dashboard");
  }

  res.render("edit-history", { record });
});


router.post("/doctor/edit-history/:id", ensureAuth, async (req, res) => {
  if (req.user.role !== "doctor") return res.redirect("/dashboard");

  const record = await MedicalHistory.findById(req.params.id);

  // 🔒 Security check again
  if (!record || record.doctorId.toString() !== req.user._id.toString()) {
    return res.redirect("/dashboard");
  }

  const { advice, medicines, notes } = req.body;

  record.advice = advice;
  record.medicines = medicines ? medicines.split(",") : [];
  record.notes = notes;

  await record.save();

  res.redirect("/doctor/patient/" + record.patientId);
});



module.exports = router;
