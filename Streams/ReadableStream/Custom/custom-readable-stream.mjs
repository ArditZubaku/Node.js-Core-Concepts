import { Readable } from "node:stream";
import fs from "node:fs";

class FileReadStream extends Readable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });

    this.fileName = fileName;
    this.fileDescriptor = null;
  }

  _construct(callback) {
    fs.open(this.fileName, "r", (err, fileDescriptor) => {
      if (err) return callback(err);

      this.fileDescriptor = fileDescriptor;
      callback();
    });
  }

  _read(size) {
    const buffer = Buffer.alloc(size);
    fs.read(this.fileDescriptor, buffer, 0, size, null, (err, bytesRead) => {
      if (err) this.destroy(err);

      // Pushes to the internal buffer
      // And triggers the "data" event
      this.push(bytesRead > 0 ? buffer.subarray(0, bytesRead) : null);

      // This will trigger the "end" event since it indicates the end of the stream
      // this.push(null);
    });
  }

  _destroy(error, callback) {
    if (this.fileDescriptor) {
      fs.close(this.fileDescriptor, (err) => callback(err || error));
    } else {
      callback(error);
    }
  }
}

const stream = new FileReadStream({ fileName: "test.txt" });

stream.on("data", (chunk) => {
  console.log(chunk.toString("utf-8"));
});

stream.on("end", () => {
  console.log("Stream is done reading.");
});
