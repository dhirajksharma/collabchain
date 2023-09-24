const mongoose=require("mongoose");

const domainSchema= new mongoose.Schema({
    name:{
        type:string,
    },
})

module.exports=mongoose.model("Domain",domainSchema);