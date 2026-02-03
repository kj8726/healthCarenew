const router = require("express").Router();
const passport = require("passport");

// 🏠 Home page (single landing page)
router.get("/", (req, res) => {
  res.render("home");
});

// 🔐 Google Login
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

// 🔁 Google Callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // New user → choose role
    if (!req.user.role) {
      return res.redirect("/choose-role");
    }

    // Profile not completed
    if (!req.user.profileCompleted) {
      return res.redirect("/complete-profile");
    }

    // Everything done
    res.redirect("/dashboard");
  }
);

// 🚪 Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

module.exports = router;
