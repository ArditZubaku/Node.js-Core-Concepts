import { open } from "node:fs/promises";
import { pipeline } from "node:stream";

(async () => {
  console.time("piping");

  const srcFile = await open("src.txt", "r");
  const destFile = await open("dest.txt", "w");

  const readStream = srcFile.createReadStream();
  const writeStream = destFile.createWriteStream();

  // Writeable stream needs to be passed
  // Handles backpressure, pause/resume and all that
  // The flow of data will be automatically managed
  //   readStream.pipe(writeStream); // Not preferred because of the poor error handling

  pipeline(readStream, writeStream, (err) => {
    if (err) {
      console.error("Pipeline failed.", err);
    }

    console.log("It destroyes the streams automatically on error.");
    console.timeEnd("piping");
  });

  //   readStream.on("end", () => console.timeEnd("piping"));
})();
