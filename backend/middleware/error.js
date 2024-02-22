const ErrorHandler=require("../utils/errorhander");

module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.message=err.message || "Internal Server Error";

    if(err.name==="CastError"){
        const message="resource not found";
        err=new ErrorHandler(message,400);
    }

    if(err.name==="JsonWebTokenError"){
        const message="Json web token is invalid";
        err=new ErrorHandler(message,400);
    }

    if(err.name==="TokenExpiredError"){
        const message="Json web token is expired";
        err=new ErrorHandler(message,400);
    }

    //mongo duplicate key error
    if(err.code===11000){
        const message='Duplicate key detected';
        err=new ErrorHandler(message,400);
    }
    
    res.status(err.statusCode).json({
        success:false,
        message:err.message,
    });
}
