import net from "node:net";

// Creates a TCP server or an IPC (inter-process-communication) server
const server = net.createServer();

const clients = [];

server.on("connection", (socket) => {
  // Duplex stream - same as the client
  // socket.write()

  clients.push(socket);

  console.log("A new connection to the server!");

  socket.on("data", (data) => {
    // console.log(data.toString("utf-8"));
    // socket.write(data);
    for (const client of clients) {
      client.write(data);
    }
  });
});

server.listen(3080, "127.0.0.1", () => {
  const address = server.address();
  console.log(`Opened server on ${address.address}:${address.port}`);
});
