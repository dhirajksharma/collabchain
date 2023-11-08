const express=require("express")
const errorMiddleware=require("./middleware/error")
const cookieParser=require("cookie-parser")
const cors=require("cors")
const dotenv=require("dotenv");
dotenv.config();

const app=express();

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:`${process.env.FRONTEND}`,
    credentials:true
}))

//Route imports
const user=require("./routes/userRoutes")
const project=require("./routes/projectRoutes")
const other=require("./routes/otherRoutes")

app.use("/api",user)
app.use("/api",project)
app.use("/api",other)

//Middleware for errors
app.use(errorMiddleware);

module.exports=app;