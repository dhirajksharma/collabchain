const Errorhander = require("../utils/errorhander");
const catchAsyncErrors=require("./catchAsyncError");
const jwt=require("jsonwebtoken");
const User=require("../models/userModel");

exports.isAuthenticatedUser=catchAsyncErrors(async(req,res,next)=>{
    const {token}=req.cookies;
    if(!token){
        return next(new Errorhander("Login to access this page",401));
    }

    const decodedData=jwt.verify(token,process.env.JWT_SECRET);

    req.user=await User.findById(decodedData.id);
    next()
});