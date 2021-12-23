const router = require("express").Router();
const authController = require("../controllers/authController");
const isAuthenticated = require("../middlewares/auth");
const passport = require("passport");

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:5000",
    failureRedirect: "/auth/login/failed",
  })
);

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successful",
      user: req.user,
      // cookies:req.cookies
      accessToken: req.accessToken,
    });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

// REGISTER A USER
router.post("/register", authController.register);

// LOGIN A USER
router.post("/login", authController.login);

// // GET A REFRESH TOKEN
// router.post("/refresh", authController.refreshToken);

// // LOGOUT USER
router.post("/logout", isAuthenticated, authController.logout);

module.exports = router;
