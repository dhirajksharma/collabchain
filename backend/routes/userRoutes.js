const express=require("express");
const { isAuthenticatedUser } = require("../middleware/auth");
const {
    registerUser,
    loginUser,
    logout,
    forgotPassword,
    resetPassword,
    getUserDetails,
    updatePassword,
    updateProfile,
    sendVerificationEmail,
    verifyEmail,
    uploadFile,
    getFile,
    getUser
  } = require("../controllers/userController");
const router=express.Router();

router.route("/register")
    .post(registerUser) //new users register
router.route("/login")
    .post(loginUser) //users login with email and password
router.route("/profile")
    .get(isAuthenticatedUser, getUserDetails) //users who previously logged in, get auto logged in if cookie not expired
router.route("/editprofile")
    .post(isAuthenticatedUser, updateProfile) //users edit their profile info
router.route("/editpassword")
    .post(isAuthenticatedUser, updatePassword) //users edit their password directly if logged in
router.route("/forgotpassword")
    .post(forgotPassword) //users request password reset token
router.route("/resetpassword/:token")
    .put(resetPassword) //users use token for password reset
router.route("/verifymail")
    .post(isAuthenticatedUser, sendVerificationEmail) //users request for email verification
router.route("/verifymail/:token")
    .post(verifyEmail) //users verify their email
router.route("/logout")
    .get(logout) //users log out of the platform
router.route("/uploads/:filetype/:userid")
    .get(getFile) //retreive the file from the server
    .post(uploadFile) //user uploads file to the server
router.route("/:userid")
    .get(getUser)

module.exports=router;