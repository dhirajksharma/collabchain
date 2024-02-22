const mongoose=require("mongoose");

const organizationSchema= new mongoose.Schema({
    name:{
        type: String,
        unique: true
    },
    email:{
        type: String,
        unique: true
    },
    address:{
        type: String,
    },
})

module.exports=mongoose.model("Organization",organizationSchema);