import fs from "node:fs/promises";
import { dirname, join } from "node:path/posix";
import { fileURLToPath } from "node:url";

// Get the current module's filename and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const srcFile = join(__dirname, "src.txt");
const bigFile = join(__dirname, "bigFile.txt");
const destFile = join(__dirname, "dest.txt");

const extractNumbers = (str) => {
  // Split the input string into lines
  const lines = str.split("\n");
  return lines.map((line) => line.slice("Line".length + 1));
};

const getPrimeNumbers = (numbers) => {
  return numbers.filter((num) => {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  });
};

const readStream = async () => {
  const [readFileHandler, writeFileHandler] = await Promise.all([
    // fs.open(bigFile, "r"),
    fs.open(srcFile, "r"),
    fs.open(destFile, "w"),
  ]);

  const readStream = readFileHandler.createReadStream({
    // By default, the highWaterMark is 64 * 1024 bytes (64kiB)
    highWaterMark: 64 * 1024,
  });
  const writeStream = writeFileHandler.createWriteStream();

  readStream.on("data", (chunk) => {
    const numbers = extractNumbers(chunk.toString());
    const primeNumbers = getPrimeNumbers(numbers);
    const buffer = Buffer.from(primeNumbers.join("\n"));

    // Pauses the read stream from reading more data until the write stream is ready
    if (!writeStream.write(buffer)) readStream.pause();
  });

  // Resumes the read stream when the write stream is ready to write more data
  writeStream.on("drain", () => readStream.resume());

  readStream.on("end", () => {
    console.log("Reading stream ended");
    writeStream.end();
  });

  writeStream.on("finish", () => console.log("Writing stream ended"));
};

readStream().catch(e => console.error(e));
