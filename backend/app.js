const express = require("express")
const errorMiddleware = require("./middleware/error")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const dotenv = require("dotenv");
const fileUpload = require('express-fileupload');
const http = require("http");
const mongoSanitize = require('express-mongo-sanitize');

dotenv.config();
const path = require('path');

const app=express();
app.use(mongoSanitize());

app.use('/uploads', express.static(path.join(__dirname,'uploads')));
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: `${process.env.FRONTEND}`,
  credentials: true
}))
// app.use(cors());
app.use(fileUpload());

//Route imports
const user = require("./routes/userRoutes")
const project = require("./routes/projectRoutes")
const other = require("./routes/otherRoutes")
const chat = require("./routes/chatRoutes")
const message = require("./routes/messageRoutes")

app.use("/api/user", user)
app.use("/api/projects", project)
app.use("/api/organization", other)
app.use("/api/chat", chat)
app.use("/api/message", message)

//Middleware for errors
app.use(errorMiddleware);

module.exports = app;