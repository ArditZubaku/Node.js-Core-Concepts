import fs from "node:fs/promises";

const test = async () => {
  console.time("copy");
  const [srcFile, destFile] = await Promise.all([
    fs.open("test.txt", "r"),
    fs.open("test-copy.txt", "w"),
  ]);

  let bytesRead = -1;

  while (bytesRead !== 0) {
    const readChunk = await srcFile.read();
    bytesRead = readChunk.bytesRead;

    if (bytesRead !== 16 * 1024) {
      const indexOfFirstZero = readChunk.buffer.indexOf(0);
      const newBuffer = Buffer.allocUnsafe(indexOfFirstZero);
      // Copy the data from the readChunk buffer to the new buffer
      readChunk.buffer.copy(newBuffer, 0, 0, indexOfFirstZero);
      await destFile.write(newBuffer);
    } else {
      await destFile.write(readChunk.buffer);
    }
  }

  await Promise.all([srcFile.close(), destFile.close()]);

  console.timeEnd("copy");
};

test();
