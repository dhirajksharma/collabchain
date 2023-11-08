const mongoose=require("mongoose");
const connectDatabase=()=>{
    let uri=process.env.NODE_ENV==='development'?process.env.DB_URI:process.env.MONGO_URI
    mongoose.connect(uri).then((data)=>{
        console.log(`MongoDB connected with server: ${data.connection.host}`);
    })
}

module.exports=connectDatabase