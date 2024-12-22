import http from "node:http";

// System Ports (0-1023)
// User Ports (1024-49151)
// Dynamic and/or Private Ports (49152-65535)
const port = 80;
// Since 80 is the default port for http I don't need to specify the port in the URL when accessing it
const hostname = "127.0.0.1";

const server = http.createServer((req, res) => {
  const data = { message: "Hi there!" };

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Connection", "close");
  res.statusCode = 200;
  res.end(JSON.stringify(data));
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
