//Creating token and saving in cookie

const sendToken=(user,statusCode,res)=>{
    const token=user.getJWTToken();

    const options={
        maxAge:3600000,
        httpOnly:true,
        sameSite:"none",
        secure:true
        };

    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        user,
        token,
    });
};

module.exports=sendToken;
