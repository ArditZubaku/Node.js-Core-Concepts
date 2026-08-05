import { Readable } from "node:stream";
import fs from "node:fs";

class FileReadStream extends Readable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });

    this.fileName = fileName;
    this.fileDescriptor = null;
  }

  _construct(next) {
    fs.open(this.fileName, "r", (err, fileDescriptor) => {
      if (err) return next(err);

      this.fileDescriptor = fileDescriptor;
      next();
    });
  }

  _read(size) {
    const buffer = Buffer.alloc(size);
    fs.read(this.fileDescriptor, buffer, 0, size, null, (err, bytesRead) => {
      if (err) return this.destroy(err);

      // Pushes to the internal buffer
      // And triggers the "data" event
      this.push(bytesRead > 0 ? buffer.subarray(0, bytesRead) : null);

      // This will trigger the "end" event since it indicates the end of the stream
      // this.push(null);
    });
  }

  _destroy(error, next) {
    if (this.fileDescriptor) {
      fs.close(this.fileDescriptor, (err) => next(err || error));
    } else {
      next(error);
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
