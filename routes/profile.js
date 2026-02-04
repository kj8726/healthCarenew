const router = require("express").Router();
const User = require("../models/User");
const upload = require("../config/multer");

// 🔒 Login check
const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
};

/* =========================
   ROLE SELECTION
========================= */

router.get("/choose-role", ensureAuth, async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user.roleSelected) {
    return res.redirect("/dashboard");
  }

  res.render("choose-role");
});

router.post("/choose-role", ensureAuth, async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, {
    role: req.body.role,
    roleSelected: true
  });

  res.redirect("/dashboard");
});

/* =========================
   COMPLETE PROFILE
========================= */

router.get("/complete-profile", ensureAuth, async (req, res) => {
  const user = await User.findById(req.user.id);

  // 🚨 Role must be chosen first
  if (!user.roleSelected) {
    return res.redirect("/dashboard");
  }

  if (!user.profileCompleted) {
    return res.render("complete-profile", { user });
  }  

  res.redirect("/dashboard");
});

router.post(
  "/complete-profile",
  ensureAuth,
  upload.single("profilePhoto"),
  async (req, res) => {
    const updateData = {
      contact: req.body.contact,
      age: req.body.age,
      profileCompleted: true
    };

    if (req.file) {
      updateData.profilePhoto = req.file.path;
    }

    if (req.user.role === "doctor") {
      updateData.specialization = req.body.specialization;
      updateData.experience = req.body.experience;
      updateData.about = req.body.about;
      updateData.degree = req.body.degree;
      updateData.clinicAddress = req.body.clinicAddress;
    }

    if (req.user.role === "patient") {
      updateData.medicalConditions = req.body.medicalConditions
        ? req.body.medicalConditions.split(",")
        : [];
    }

    await User.findByIdAndUpdate(req.user.id, updateData);
    res.redirect("/dashboard");
  }
);

/* =========================
   VIEW PROFILE
========================= */

router.get("/profile", ensureAuth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.render("profile", { user });
});

// ✏️ UPDATE PROFILE (MISSING ROUTE)
router.post(
  "/profile",
  ensureAuth,
  upload.single("profilePhoto"),
  async (req, res) => {
    const updates = req.body;

    if (req.file) {
      updates.profilePhoto = req.file.path;
    }

    await User.findByIdAndUpdate(req.user.id, updates);
    res.redirect("/profile");
  }
);


// 🗑️ DELETE PROFILE
router.post("/profile/delete", ensureAuth, async (req, res) => {
  // 1️⃣ Delete user from database
  await User.findByIdAndDelete(req.user.id);

  // 2️⃣ Logout user & destroy session
  req.logout(() => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
});




module.exports = router;
