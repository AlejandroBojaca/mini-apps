const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("Client has connected");

  socket.on("message", ({ username, message }) => {
    console.log(`Received message from ${username}: ${message}`);
    io.emit("message", { username, message });
  });
});

httpServer.listen(3000, () => console.log("Listening on port 3000 ..."));
