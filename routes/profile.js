const router = require("express").Router();
const User = require("../models/User");
const upload = require("../config/multer");


// 🔒 Login check middleware
const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
};

// 👤 Choose role (Doctor / Patient)
router.get("/choose-role", ensureAuth, (req, res) => {
  res.render("choose-role");
});

router.post("/choose-role", ensureAuth, async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, {
    role: req.body.role
  });

  res.redirect("/complete-profile");
});


// 📄 View profile
router.get("/profile", ensureAuth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.render("profile", { user });
});

// ✏️ Update profile
router.post("/profile", ensureAuth, upload.single("profilePhoto"), async (req, res) => {
  const updates = req.body;

  if (req.file) {
    updates.profilePhoto = req.file.path;
  }

  await User.findByIdAndUpdate(req.user.id, updates);
  res.redirect("/profile");
});


// 📝 Complete Profile
router.get("/complete-profile", ensureAuth, (req, res) => {
  res.render("complete-profile", { user: req.user });
});

router.post("/complete-profile", ensureAuth, async (req, res) => {
  const updateData = {
    contact: req.body.contact,
    age: req.body.age,
    address: req.body.address,
    profileCompleted: true
  };

  // Doctor extra fields
  if (req.user.role === "doctor") {
    updateData.specialization = req.body.specialization;
  }

  // Patient extra fields
  if (req.user.role === "patient") {
    updateData.medicalConditions = req.body.medicalConditions
      ? req.body.medicalConditions.split(",")
      : [];
  }

  await User.findByIdAndUpdate(req.user.id, updateData);
  res.redirect("/dashboard");
});

module.exports = router;
