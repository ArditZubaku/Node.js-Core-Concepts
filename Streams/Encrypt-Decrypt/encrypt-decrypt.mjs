// encryption/decryption => crypto
// compression/decompression => zlib
// hashing & salting => crypto
// decoding/encoding => buffer

import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import fs from "node:fs/promises";

class Encrypt extends Transform {
  constructor(key, size) {
    super();
    this.key = key;
    this.size = size;
  }

  // You shouldn't implement the _write, _read, _final methods
  // They are all implemented/inherited
  // You should only implement the _transform method
  // _transform(chunk, encoding, callback) {
  //   for (let i = 0; i <= chunk.length; ++i) {
  //     if (chunk[i] !== 255) chunk[i] += 1;
  //   }
  //   this.push(chunk.toString());
  //   callback();
  // }
  _transform(chunk, encoding, callback) {
    const encryptedData = Buffer.from(chunk.map((byte) => byte ^ this.key));

    const percentage = (chunk.length / this.size) * 100;
    console.log(`Encrypting... ${percentage.toFixed(2)}%`);
    this.size -= chunk.length;

    this.push(encryptedData);
    callback();
  }
}

class Decrypt extends Transform {
  constructor(key, size) {
    super();
    this.key = key;
    this.size = size;
  }
  // _transform(chunk, encoding, callback) {
  //   for (let i = 0; i <= chunk.length; ++i) {
  //     if (chunk[i] !== 255) chunk[i] -= 1;
  //   }
  //   this.push(chunk.toString());
  //   callback();
  // }

  _transform(chunk, encoding, callback) {
    const decryptedData = Buffer.from(chunk.map((byte) => byte ^ this.key));

    const percentage = (chunk.length / this.size) * 100;
    console.log(`Decrypting... ${percentage.toFixed(2)}%`);
    this.size -= chunk.length;

    this.push(decryptedData);
    callback();
  }
}

(async () => {
  const key = 123;
  // const readFileHandler = await fs.open("read.txt", "r");
  const readFileHandler = await fs.open("test.txt", "r");
  const writeFileHandler = await fs.open("write.txt", "w");

  const { size } = await readFileHandler.stat();
  console.log("SIZE", size);

  const readStream = readFileHandler.createReadStream();
  const writeStream = writeFileHandler.createWriteStream();

  const encrypt = new Encrypt(key, size);
  const decrypt = new Decrypt(key, size);

  // readStream.pipe(encrypt).pipe(decrypt).pipe(writeStream);

  encrypt.on("end", () => console.log("Encryption completed."));
  decrypt.on("end", () => console.log("Decryption completed."));

  try {
    await pipeline(readStream, encrypt, decrypt, writeStream);
    console.log("Pipeline succeeded.");
  } catch (err) {
    console.error("Pipeline failed.", err);
  }
})();

const twoStreams = async () => {
  const key = 123;
  const readFileHandler = await fs.open("test.txt", "r");
  const encryptedFileHandler = await fs.open("encrypted.txt", "w");
  const decryptedFileHandler = await fs.open("decrypted.txt", "w");

  const { size } = await readFileHandler.stat();
  console.log("SIZE", size);

  const readStream = readFileHandler.createReadStream();
  const encryptedStream = encryptedFileHandler.createWriteStream();
  const decryptedStream = decryptedFileHandler.createWriteStream();

  const encrypt = new Encrypt(key, size);
  const decrypt = new Decrypt(key, size);

  try {
    await pipeline(readStream, encrypt, encryptedStream);
    console.log("Encryption pipeline succeeded.");

    const encryptedReadStream = await fs
      .open("encrypted.txt", "r")
      .then((handler) => handler.createReadStream());

    await pipeline(encryptedReadStream, decrypt, decryptedStream);
    console.log("Decryption pipeline succeeded.");
  } catch (err) {
    console.error("Pipeline failed.", err);
  }
};

// await twoStreams();
