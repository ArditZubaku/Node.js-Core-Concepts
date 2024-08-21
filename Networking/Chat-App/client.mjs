import net from "node:net";
import * as readline from "node:readline/promises";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const clearLine = (direction) =>
  new Promise((resolve, _reject) => {
    process.stdout.clearLine(direction, () => {
      resolve();
    });
  });

const moveCursor = (dx, dy) =>
  new Promise((resolve, _reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });

const ask = async () => {
  const answer = await rl.question("Enter a message > ");

  // Move the cursor one line up
  await moveCursor(0, -1);

  // Clear the line in which the cursor is in
  await clearLine(0);
  socket.write(answer);
};

// Creates a client, and it needs to connect to a server (port)
// Gets assigned a dynamic port by the OS
const socket = net.createConnection(
  {
    host: "127.0.0.1",
    port: 3080,
  },
  async () => {
    console.log("Connected to the server!");
    await ask();
  },
);

socket.on("data", async (data) => {
  console.log();
  await moveCursor(0, -1);
  await clearLine(0);
  console.log(data.toString("utf-8"));

  await ask();
});

socket.on("close", () => {
  console.log("Closed!");
});

socket.on("end", () => {
  console.log("Ended!");
});
