const app=require("./app");
const dotenv=require("dotenv");
dotenv.config();
const connectDatabase=require("./config/database");

//Handling uncaught exception
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server");
    process.exit(1);

})

//connecting to database [NOTE: connecting after config file to make sure it gets those variables]
connectDatabase()
.then(()=>{
    const PORT=process.env.PORT || 4000
    app.listen(PORT,()=>{
        console.log(`Server is working on https://localhost:${PORT}`);
    })
})

process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server");
    
    server.close(()=>{
        process.exit(1);
    });
})