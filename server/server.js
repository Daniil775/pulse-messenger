const express = require("express");
const http = require("http");
const path = require("path");
const {Server} = require("socket.io")

const PORT = process.env.PORT || 3001
const app = express()
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname,"../client")));

io.on("connection", (socket) => {
    let username = "Anonymus"
    console.log("🔵" + socket.id + " user connected")

    socket.on('set username',(name) =>{
        username = name;
    })

    socket.on("chat message", ({msg,hour,min}) =>{
        console.log('Message: ' + msg + ' at ' + hour + ':' + min);
        io.emit("chat message", {msg,hour,min,username})
    })
})



server.listen(PORT,()=> {
    console.log(`Сервер запущен на порту ${PORT}`)
})