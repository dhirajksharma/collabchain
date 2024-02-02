const mongoose=require("mongoose");

const connectDatabase=async ()=>{
    let uri=process.env.NODE_ENV==='development'?process.env.DB_URI:process.env.MONGO_URI
    await mongoose.connect(uri)
    .then((data)=>{
        console.log(`MongoDB connected with server: ${data.connection.host}`);
    })
    .catch((error)=>{
        console.log('MongoDB connection failed ', error);
        process.exit(1);
    })
}

module.exports=connectDatabase