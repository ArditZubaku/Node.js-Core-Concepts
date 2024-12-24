import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { log } from "node:console";

const server = createServer();

server.on("request", (req, res) => {
  if (req) {
    log("Incoming request", req.method);
  }
  const result = readFileSync("./Test.txt");

  res.setHeader("Content-Type", "text/plain");

  res.end(result);
});

server.listen(4080, "127.0.0.1", () => {
  log("Server has started on:", server.address());
});
