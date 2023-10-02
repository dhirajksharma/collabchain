const express=require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const {
    registerUser,
    loginUser,
    logout,
    forgotPassword,
    resetPassword,
    getUserDetails,
    updatePassword,
    updateProfile,
    getAllUser,
    getSingleUser,
    sendVerificationEmail,
    verifyEmail
  } = require("../controllers/userController");
const router=express.Router();

router.route("/user/register")
    .post(registerUser) //new users register
router.route("/user/login")
    .post(loginUser) //users login with email and password
router.route("/user/profile")
    .get(isAuthenticatedUser, getUserDetails) //users who previously logged in, get auto logged in if cookie not expired
router.route("/user/editprofile")
    .post(isAuthenticatedUser, updateProfile) //users edit their profile info
router.route("/user/editpassword")
    .post(isAuthenticatedUser, updatePassword) //users edit their password directly if logged in
router.route("/user/forgotpassword")
    .post(forgotPassword) //users request password reset token
router.route("/user/resetpassword/:token")
    .put(resetPassword) //users use token for password reset
router.route("/user/verifymail")
    .post(sendVerificationEmail) //users request for email verification
router.route("/user/verifymail/:token")
    .post(verifyEmail) //users verify their email
router.route("/user/logout")
    .get(logout) //users log out of the platform

module.exports=router;