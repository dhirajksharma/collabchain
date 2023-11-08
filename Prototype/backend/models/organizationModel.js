const mongoose=require("mongoose");

const organizationSchema= new mongoose.Schema({
    name:{
        type:string,
    },
    address:{
        type:string,
    }
})

module.exports=mongoose.model("Organization",organizationSchema);