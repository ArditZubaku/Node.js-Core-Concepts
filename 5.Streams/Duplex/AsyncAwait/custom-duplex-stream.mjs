import { Duplex } from "node:stream";
import fs from "node:fs/promises";

class DuplexStream extends Duplex {
  constructor({
    writableHighWaterMark,
    readableHighWaterMark,
    writeFileName,
    readFileName,
  }) {
    super({ writableHighWaterMark, readableHighWaterMark });

    this.writeFileName = writeFileName;
    this.readFileName = readFileName;
    this.writeFileDescriptor = null;
    this.readFileDescriptor = null;
    this.chunks = [];
    this.chunksSize = 0;
    this.numberOfWrites = 0;
  }

  async _construct(callback) {
    try {
      this.readFileDescriptor = await fs.open(this.readFileName, "r");
      this.writeFileDescriptor = await fs.open(this.writeFileName, "w");
      callback();
    } catch (err) {
      callback(err);
    }
  }

  async _read(size) {
    try {
      const buffer = Buffer.alloc(size);
      const { bytesRead } = await this.readFileDescriptor.read(
        buffer,
        0,
        size,
        null,
      );
      this.push(bytesRead > 0 ? buffer.subarray(0, bytesRead) : null);
    } catch (err) {
      this.destroy(err);
    }
  }

  async _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.chunksSize += chunk.length;

    if (this.chunksSize >= this.writableHighWaterMark) {
      try {
        const buffer = Buffer.concat(this.chunks);
        const { bytesWritten } = await this.writeFileDescriptor.write(buffer);
        this.chunks = [];
        this.chunksSize = 0;
        ++this.numberOfWrites;
        console.log(`Number of bytes written was: ${bytesWritten}`);
        callback();
      } catch (err) {
        callback(err);
      }
    } else {
      callback();
    }
  }

  async _final(callback) {
    try {
      const buffer = Buffer.concat(this.chunks);
      const { bytesWritten } = await this.writeFileDescriptor.write(buffer);
      console.log(`Total writes: ${this.numberOfWrites + 1}`);
      console.log(`Total bytes written: ${bytesWritten}`);
      this.chunks = [];
      this.chunksSize = 0;
      ++this.numberOfWrites;
      callback();
    } catch (err) {
      callback(err);
    }
  }

  async _destroy(error, callback) {
    try {
      if (this.readFileDescriptor) {
        await this.readFileDescriptor.close();
      }
      if (this.writeFileDescriptor) {
        await this.writeFileDescriptor.close();
      }
      callback();
    } catch (err) {
      callback(err || error);
    }
  }
}

const duplex = new DuplexStream({
  readFileName: "read.txt",
  writeFileName: "write.txt",
});

duplex.write(Buffer.from("This is just a string 0\n"), () => {
  console.log("Writing");
});
duplex.write(Buffer.from("This is just a string 1\n"));
duplex.write(Buffer.from("This is just a string 2\n"));
duplex.write(Buffer.from("This is just a string 3\n"));
duplex.end(Buffer.from("End of stream"));

duplex.on("data", (chunk) => {
  console.log("Reading");
  console.log(chunk);
  console.log(chunk.toString("hex"));
  console.log(chunk.toString("utf-8"));
});
