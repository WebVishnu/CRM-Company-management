const express = require("express");
const router = express.Router();
const path = require("path");
const {
  homePage,
  RegisterUser,
  LoginUser,
  viewCustomerServiceReport,
  LogOutUser,
} = require(path.join(__dirname, "../controller/userController"));
const { adminLogin } = require(path.join(
  __dirname,
  "../controller/adminController"
));
// router.get('', (req, res) => { homePage(req, res) })
router.get("", (req, res) => {
  adminLogin(req, res);
});
// loginned user
router.get("/blogs", (req, res, next) => {
  res.render("user/blogs/blogs");
});
// SIGN UP
router.get("/user/sign-up", (req, res) => {
  res.render("user/signup/signup");
});
// SIGN IN
router.get("/user/sign-in", (req, res) => {
  res.render("user/signin/signin");
});
// LOG OUT
router.get("/user/log-out", (req, res) => {
  LogOutUser(req, res);
});

// SIGN UP -- POST
router.post("/user/sign-up", (req, res) => {
  RegisterUser(req, res);
});

// SIGN IN -- POST
router.post("/user/sign-in", (req, res) => {
  LoginUser(req, res);
});
// view service report
router.get("/user/service-report/view/:id", (req, res) => {
  viewCustomerServiceReport(req, res);
});

module.exports = router;
