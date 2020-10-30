require("dotenv").config();
const port = process.env.PORT;
const http = require('http') 
const path = require("path");
const express = require("express");
const socketio = require('socket.io')

const app = express();
const server = http.createServer(app)
const io = socketio(server)




//  paths
const publicDirectory = path.join(__dirname, "../public");

app.use(express.static(publicDirectory));

app.get("", (req, res) => {
  res.render("index");
});

let count = 0


io.on('connection', (socket)=>{
  console.log("New network connection")

  socket.emit('countUpdated', count)
  socket.on('increment', ()=>{
    count++
    io.emit('countUpdated', count)
  })
})

server.listen(port, () => {
  console.log(`server's up on port ${port}`);
});
