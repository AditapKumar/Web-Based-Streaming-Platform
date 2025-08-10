import http from "http";
import path from "path";
import express from "express";
import { Server as SocketIO } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);

app.use(express.static(path.resolve("./public")));

io.on("connection", (socket) => {
  console.log("Socket Connected with ID:", socket.id);
  socket.on('binaryStream', stream => {
    console.log('Binary Stream Incoming...')
  })
});

server.listen(3000, () => {
  console.log(`HTTP Server is running on Port 3000`);
  console.log("Socket.IO server is ready for connections");
});
