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
    phone:{
        type:Number,
    },
    aadhar:{
        type:Number,
        required: true
    },
    role:{
        type:String,
        default:"contributor",
    },
    avatar:{
        public_id:{
            type:string,
            required:true,
        },
        url:{
            type:string,
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
            type:string
        }
    },
    resume:{
        public_id:{
            type:string,
            required:true,
        },
        url:{
            type:string,
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

module.exports=mongoose.model("User",userSchema);