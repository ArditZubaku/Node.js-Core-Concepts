import { Writable } from "node:stream";
import fs from "node:fs";

class FileWriteStream extends Writable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });

    this.fileName = fileName;
    this.fileDescriptor = null;
    this.chunks = [];
    this.chunksSize = 0;
    this.numberOfWrites = 0;
  }

  _construct(callback) {
    // This method is called when the stream is being constructed
    // We can do some initialization here
    fs.open(this.fileName, "w", (err, fileDescriptor) => {
      if (err) {
        // Don't throw an error here, just pass it to the callback
        return callback(err);
      }

      this.fileDescriptor = fileDescriptor;
      // When done, call the callback
      // No arguments means successfull completion
      callback();
    });
  }

  // To implement a writable stream, we need to implement the _write method
  // not the write method
  _write(chunk, encoding, callback) {
    // Do our writing here
    this.chunks.push(chunk);
    this.chunksSize += chunk.length;

    if (this.chunksSize >= this.highWaterMark) {
      fs.write(
        this.fileDescriptor,
        Buffer.concat(this.chunks),
        (err, bytesWritten) => {
          if (err) {
            return callback(err);
          }

          this.chunks = [];
          this.chunksSize = 0;
          // faster than this.numberOfWrites++
          ++this.numberOfWrites;
          // When done, call the callback
          callback();
        },
      );
    } else {
      // When done, call the callback
      callback();
    }
  }

  _final(callback) {
    // This method is called when the stream is being closed
    // We can do some final operations here
    fs.write(
      this.fileDescriptor,
      Buffer.concat(this.chunks),
      (err, bytesWritten) => {
        if (err) {
          return callback(err);
        }
        console.log(`Total writes: ${this.numberOfWrites + 1}`);
        console.log(`Total bytes written: ${bytesWritten}`);

        this.chunks = [];
        this.chunksSize = 0;
        ++this.numberOfWrites;

        // Notifies Node.js that we are done
        callback();
      },
    );
  }

  _destroy(error, callback) {
    // This method is called when the stream is being destroyed
    // We can do some cleanup here
    console.log("Number of writes: ", this.numberOfWrites);

    if (this.fileDescriptor) {
      fs.close(this.fileDescriptor, (err) => {
        if (err || error) {
          return callback(err || error);
        }
      });
    } else {
      callback(error);
    }
  }
}

const stream = new FileWriteStream({
  highWaterMark: 1024,
  fileName: "file.txt",
});

// .write triggers the _write method
// don't call it as _write, it is called automatically
stream.write(Buffer.from("Hello, World!"));
// .end triggers the _final method
stream.end("Last write");

stream.on("finish", () => {
  console.log("Stream finished writing");
});
