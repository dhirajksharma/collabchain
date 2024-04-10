const Errorhander = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    // console.log(req.body);
    // console.log(req);
    // const { token } = req.cookies;
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZjVjNjFjMDI3NzI3MzJmMDUxZTA1YyIsImlhdCI6MTcxMjcwOTcxNiwiZXhwIjoxNzEzMTQxNzE2fQ.3byaR5hGc6v2y7XrFwqN27cJ8FDtaoeBwYIxxKVX3kQ";
    if (!token) {
        return next(new Errorhander("Login to access this page", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);
    next()
});