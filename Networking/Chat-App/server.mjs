import net from "node:net";

// Creates a TCP server or an IPC (inter-process-communication) server
const server = net.createServer();

const clients = [];

server.on("connection", (socket) => {
  // Duplex stream - same as the client
  // socket.write()
  console.log("A new connection to the server!");

  const clientId = clients.length + 1;
  clients.push({
    id: clientId.toString(),
    client: socket,
  });

  socket.write(`ID-${clientId}`);

  socket.on("data", (data) => {
    // console.log(data.toString("utf-8"));
    // socket.write(data);

    const dataString = data.toString("utf-8");
    const clientId = dataString.substring(0, dataString.indexOf(":"));
    const messageTag = ":Message-";
    const message = dataString.substring(
      dataString.indexOf(messageTag) + messageTag.length,
    );

    for (const { client } of clients) {
      client.write(`> User ${clientId}: ${message}`);
    }
  });
});

server.listen(3080, "127.0.0.1", () => {
  const address = server.address();
  console.log(`Opened server on ${address.address}:${address.port}`);
});
