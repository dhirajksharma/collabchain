const ApiResponse = require("../utils/ApiResponse.js");

const sendToken=(user,statusCode,res)=>{
    const token=user.getJWTToken();
    let cookieSecurity=process.env.NODE_ENV==='development'?false:true
    const options={
        maxAge:3600000,
        httpOnly:true,
        sameSite:"none",
        secure:cookieSecurity
        };

    res.status(statusCode).cookie('token',token,options).json(new ApiResponse(statusCode, {user, token}));
};

module.exports=sendToken;
