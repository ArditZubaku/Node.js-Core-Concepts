import fs from "node:fs/promises";

// DON'T DO IT THIS WAY - high memory usage
// (async () => {
//   console.time("streamWriteMany");
//   console.log("This is way faster compared to the benchmarked version");
//   console.log("250ms");
//   const fileHandler = await fs.open("test.txt", "w");

//   const stream = fileHandler.createWriteStream();

//   for (let i = 0; i <= 1_000_000; i++) {
//     const buffer = Buffer.from(`Line ${i}\n`);
//     stream.write(buffer);
//   }

//   await fileHandler.close();
//   console.timeEnd("streamWriteMany");
// })();

const test = async () => {
  const fileHandler = await fs.open("test.txt", "w");

  const stream = fileHandler.createWriteStream();

  // for (let i = 0; i <= 1_000_000; i++) {
  //   const buffer = Buffer.from(`Line ${i}\n`);
  //   stream.write(buffer);
  // }
  /*
  // Internal buffer size
  console.log(stream.writableHighWaterMark);

  // Data that is yet to be written
  console.log(stream.writableLength);

  // Write data to the stream
  stream.write(Buffer.from("Hello"));

  // Data that is yet to be written
  console.log(stream.writableLength);

  await fileHandler.close();
  console.timeEnd("streamWriteMany");
  */

  console.log(stream.writableHighWaterMark);
  // const buffer = Buffer.alloc(1024 * 1024 * 100, "a");
  const buffer = Buffer.alloc(stream.writableHighWaterMark + 10, "a");
  const canStillWrite = stream.write(buffer);
  console.log(canStillWrite);
  console.log(stream.writableLength);

  stream.on("drain", () => {
    console.log("We are safe to write more data to the stream");
  });

  console.log(stream.writableLength);
  stream.write(Buffer.allocUnsafeSlow(1));

  stream.on("drain", () => {
    console.log("DRAINING");
  });

  console.log(stream.writableLength);

  // fileHandler.close();
};

const createBigFile = async (numberOfLines, fileName) => {
  console.time("fixLoop");
  const fileHandler = await fs.open(fileName, "w");
  const stream = fileHandler.createWriteStream();

  let i = 0;
  const writeMany = async () => {
    while (i <= numberOfLines) {
      const buffer = Buffer.from(`Line ${i}\n`, "utf-8");
      if (i === numberOfLines) {
        // Last write to the stream and close it
        // We can also pass a callback to the end method, or listen to the finish event
        return stream.end(buffer, () => console.log("This gets logged first"));
      }

      i++;

      const canWrite = stream.write(buffer);
      if (!canWrite) break;
    }
  };

  await writeMany();
  stream.on("drain", () => writeMany());
  stream.on("finish", async () => {
    await fileHandler.close();
    console.timeEnd("fixLoop");
  });
};

createBigFile(1_000_000_000, "bigFile2.txt").catch(e => console.error(e));
