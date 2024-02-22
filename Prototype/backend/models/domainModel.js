const mongoose=require("mongoose");

const domainSchema= new mongoose.Schema({
    name:{
        type: String,
        unique: true,
    },
})

module.exports=mongoose.model("Domain",domainSchema);