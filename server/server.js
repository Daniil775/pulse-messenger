const express = require("express");
const http = require("http");
const path = require("path");
const {Server} = require("socket.io")

const PORT = process.env.PORT || 3001
const app = express()
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname,"../client")));

const online_users = new Map();
let username = "Anonymus"

io.on("connection", (socket) => {
    
    console.log("🔵" + socket.id + " user connected")

    socket.on('set username',(name) =>{
        username = name;
    })

    socket.on("chat message", ({msg,hour,min}) =>{
        console.log('Message: ' + msg + ' at ' + hour + ':' + min);
        io.emit("chat message", {msg,hour,min,username})
    })

    socket.on("typing", (data)=>{
        console.log(data + " text message...")
        socket.broadcast.emit("user typing",data)
    })

    socket.on("stop typing", (data)=>{
        console.log(data + " stop typing")
        socket.broadcast.emit("user stop typing",data)
    })

    socket.on("join",(name)=>{
        socket.username = name;
        online_users.set(socket.id,name)
        io.emit("online users", {
        users: [...online_users.values()],
        count: online_users.size
        })
    })

    

    socket.on("disconnect", () => {
        online_users.delete(socket.id)

        io.emit("online users", {
            users: [...online_users.values()],
            count: online_users.size
        })
    })
})



server.listen(PORT,()=> {
    console.log(`Сервер запущен на порту ${PORT}`)
})