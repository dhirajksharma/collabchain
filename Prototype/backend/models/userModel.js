const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const dotenv=require("dotenv");
const crypto=require("crypto");
dotenv.config();

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please enter user name"],
        minLength:[3, "Please enter full name"]
    },
    email:{
        type:String,
        required:[true,"Please enter email"],
        unique:true,
        validate:[validator.isEmail, "Please enter valid email"]
    },
    verifyEmailStatus:{
        type:Boolean,
        default:false
    },
    phone:{
        type:Number,
    },
    aadhar:{
        type:Number,
        required: true
    },
    role:{
        type:String,
        default:"mentee",
    },
    avatar:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        }
    },
    password:{
        type:String,
        required:[true, "Please enter password"],
        minLength:[6,"Password cannot have less than 6 characters"],
        select:false,
    },
    organization:{
        organization_id:{
            type: mongoose.Schema.ObjectId,
            ref:"Organization",
        },
        designation:{
            type:String
        }
    },
    resume:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        }
    },
    project_ongoing:{
        type: mongoose.Schema.ObjectId,
        ref:"Project",
    },
    projects_completed:[
        {
            type: mongoose.Schema.ObjectId,
            ref:"Project",
        }
    ],
    projects_saved:[
        {
            type: mongoose.Schema.ObjectId,
            ref:"Project",
        }
    ],

    resetPasswordToken:String,
    resetPasswordExpire:Date,
    verifyEmailToken:String,
    verifyEmailExpire:Date,
})


userSchema.pre("save", async function(next){

    if(!this.isModified("password")){
        next();
    }
    this.password=await bcrypt.hash(this.password,10);
})

//JWT Token
userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE,
    });
}

//Compare passwords
userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

//Generating password reset token
userSchema.methods.getResetPasswordToken=function(){
    const resetToken=crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire=Date.now()+15*60*1000;

    return resetToken;
}

//Generating email verification token
userSchema.methods.getResetPasswordToken=function(){
    const verificationToken=crypto.randomBytes(5).toString("hex");

    this.verifyEmailToken=crypto.createHash("sha256").update(verificationToken).digest("hex");
    this.verifyEmailExpire=Date.now()+5*60*1000;

    return verificationToken;
}
module.exports=mongoose.model("User",userSchema);