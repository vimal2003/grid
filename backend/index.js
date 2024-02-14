const express=require("express");
const app=express();
const http=require("http");
const {Server}=require('socket.io');
const cors=require('cors')
const dotenv=require('dotenv')
const path=require('path')
const connectDatabase = require('./config/database');
dotenv.config({path:path.join(__dirname,"config/config.env")})
app.use(express.json())
app.use(cors())
connectDatabase();
const server=http.createServer(app);
const grid=require('./routes/grid')

app.use('/grid',grid)
const io=new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
})
io.on("connection",(socket)=>{
    console.log(`user connected: ${socket.id}`)

    socket.on("add_chat",(data,page)=>{
        socket.broadcast.emit("add_chat",data,page);
    })

    socket.on("edit_chat",(data)=>{
        socket.broadcast.emit("edit_chat",data);
    })

    socket.on("delete_chat",(cur,data)=>{
        socket.broadcast.emit("delete_chat",cur,data);
    })

    socket.on("disconnect",()=>{
        console.log(`User Disconnected`,socket.id)
    })
})

module.exports=app;

server.listen(process.env.PORT,()=>{
    console.log(`server  running at port ${process.env.PORT}`)
})