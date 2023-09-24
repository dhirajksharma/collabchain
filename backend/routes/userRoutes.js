const express=require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router=express.Router();

router.route("/user/register")
    .post() //new users register
router.route("/user/login")
    .post() //users login with email and password
router.route("/user/profile")
    .get() //users who previously logged in, get auto logged in if cookie not expired
router.route("/user/editprofile")
    .post() //users edit their profile info
router.route("/user/editpassword")
    .post() //users edit their password directly if logged in
router.route("/user/forgotpassword")
    .post() //users request password reset token
router.route("/user/resetpassword/:token")
    .post() //users use token for password reset
router.route("/user/verifymail")
    .post() //users request otp for email verification
router.route("/user/verifymail/:token")
    .post() //users verify their email otp
router.route("/user/logout")
    .get() //users log out of the platform

module.exports=router;