import { Duplex } from "node:stream";
import fs from "node:fs";

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

  _construct(callback) {
    fs.open(this.readFileName, "r", (err, readFd) => {
      if (err) return callback(err);
      this.readFileDescriptor = readFd;

      fs.open(this.writeFileName, "w", (err, writeFd) => {
        if (err) return callback(err);

        this.writeFileDescriptor = writeFd;
        callback();
      });
    });
  }

  _read(size) {
    const buffer = Buffer.alloc(size);
    fs.read(
      this.readFileDescriptor,
      buffer,
      0,
      size,
      null,
      (err, bytesRead) => {
        if (err) this.destroy(err);

        this.push(bytesRead > 0 ? buffer.subarray(0, bytesRead) : null);
      },
    );
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.chunksSize += chunk.length;

    if (this.chunksSize >= this.writableHighWaterMark) {
      fs.write(
        this.writeFileDescriptor,
        Buffer.concat(this.chunks),
        (err, bytesWritten) => {
          if (err) {
            return callback(err);
          }

          this.chunks = [];
          this.chunksSize = 0;
          ++this.numberOfWrites;
          console.log(`Number of bytes written was: ${bytesWritten}`);
          callback();
        },
      );
    } else {
      callback();
    }
  }

  _final(callback) {
    fs.write(
      this.writeFileDescriptor,
      Buffer.concat(this.chunks),
      (err, bytesWritten) => {
        if (err) return callback(err);

        console.log(`Total writes: ${this.numberOfWrites + 1}`);
        console.log(`Total bytes written: ${bytesWritten}`);

        this.chunks = [];
        this.chunksSize = 0;
        ++this.numberOfWrites;

        callback();
      },
    );
  }

  _destroy(error, callback) {
    if (this.readFileDescriptor) {
      fs.close(this.readFileDescriptor, (err) => callback(err || error));
      if (this.writeFileDescriptor) {
        fs.close(this.writeFileDescriptor, (err) => callback(err || error));
      } else {
        callback(error);
      }
    } else {
      callback(error);
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
