import { open, appendFile } from "node:fs/promises";

(async () => {
  try {
    console.time("writeMany");
    const fileHandler = await open("./file.txt", "a");

    for (let i = 0; i <= 1_000_000; i++) {
      await appendFile(fileHandler, `Line ${i}\n`);
    }

    await fileHandler.close();

    console.log("File written successfully");

    console.timeEnd("writeMany");
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error("File not found");
    } else {
      console.error("An error occurred");
    }
  }
})();

(async () => {
  try {
    console.time("writeMany2");
    const fileHandler = await open("./file2.txt", "a");

    let lines = "";
    for (let i = 0; i <= 1_000_000; i++) {
      lines += `Line ${i}\n`;
    }

    await fileHandler.write(lines);
    await fileHandler.close();

    console.log("File written successfully");

    console.timeEnd("writeMany2");
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error("File not found");
    } else {
      console.error("An error occurred");
    }
  }
})();

(async () => {
  try {
    console.time("writeMany3");
    const fileHandler = await open("./file3.txt", "a");

    let lines = "";
    for (let i = 0; i <= 1_000_000; i++) {
      lines += `Line ${i}\n`;
    }

    await fileHandler.appendFile(lines);
    await fileHandler.close();

    console.log("File written successfully");

    console.timeEnd("writeMany3");
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error("File not found");
    } else {
      console.error("An error occurred");
    }
  }
})();

import fs from "node:fs";

(() => {
  console.time("writeMany4");
  console.log("This is way faster than the promisified version");

  fs.open("./file4.txt", "w", (err, fileDescriptor) => {
    if (err) {
      console.log(err);
      return;
    }

    const buffer = Buffer.from("Line\n", "utf-8");

    for (let i = 0; i <= 1_000_000; i++) {
      // Node.js converts this to a buffer before writing it to the file
      // fs.writeSync(fileDescriptor, `Line ${i}\n`);
      fs.writeSync(fileDescriptor, buffer);
    }
    fs.closeSync(fileDescriptor);

    console.log("File written successfully");
    console.timeEnd("writeMany4");
  });
})();

(() => {
  console.time("writeMany5");

  fs.open("./file5.txt", "w", (err, fileDescriptor) => {
    if (err) {
      console.log(err);
      return;
    }

    for (let i = 0; i <= 1_000_000; i++) {
      // This way doesn't guarantee that the file will be written in order
      // It is async, it is faster than the async/await version but it is not guaranteed to be in order
      // Occupies a lot of memory
      fs.write(fileDescriptor, `Line ${i}\n`, () => {});
    }
    fs.close(fileDescriptor);

    console.timeEnd("writeMany5");
  });
})();
