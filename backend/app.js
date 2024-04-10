const express = require("express")
const errorMiddleware = require("./middleware/error")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const dotenv = require("dotenv");
const fileUpload = require('express-fileupload');
const http = require("http");
const { Server } = require("socket.io");
const { initializeSocketIO } = require("./socket/index.js");
dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: `${process.env.FRONTEND}`,
    credentials: true,
  },
});

app.set("io", io); // using set method to mount the `io` instance on the app to avoid usage of `global`

app.use(express.json())
app.use(cookieParser())
// app.use(cors({
//     origin:`${process.env.FRONTEND}`,
//     credentials:true
// }))
app.use(cors());
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

initializeSocketIO(io);

module.exports = app;