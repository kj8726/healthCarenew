const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
require("dotenv").config();

// DB connection
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const dashboardRoutes = require("./routes/dashboard");

const app = express();

// 🔗 Connect MongoDB
connectDB();

// 🔧 Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 🧠 Session
app.use(
  session({
    secret: "doctor-appointment-secret",
    resave: false,
    saveUninitialized: false
  })
);

// 🔐 Passport
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport");

// 🎨 Static files
app.use(express.static(path.join(__dirname, "public")));

// 🖼️ View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 🚏 Routes
app.use("/", authRoutes);
app.use("/", profileRoutes);
app.use("/", dashboardRoutes);
  
// ❌ 404 handler
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
