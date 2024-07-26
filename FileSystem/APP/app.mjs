import { watch, open, unlink, rename } from "node:fs/promises";
import { writeFile } from "node:fs";

(async () => {
  const FILE_PATH = "./command.txt";
  const EVENT_NAME = "change";

  const COMMANDS = {
    CREATE: "create a file",
    DELETE: "delete a file",
    UPDATE: "update a file",
    RENAME: "rename a file",
    APPEND: "add to a file",
  };

  const isValidPath = (path) => {
    return /\.(txt|csv|mjs|js|ts|json)$/i.test(path);
  };

  const createFile = async (path) => {
    // Create a file
    try {
      const existingFileHandler = await open(path, "r");
      existingFileHandler.close();

      return console.log("File already exists");
    } catch (error) {
      const newFileHandler = await open(path, "w");
      console.log("File created");

      newFileHandler.close();
    }
  };

  const deleteFile = async (path) => {
    // Delete a file
    try {
      const existingFileHandler = await open(path, "r");
      existingFileHandler.close();

      await unlink(path);
      console.log("File deleted");
    } catch (error) {
      console.log("File does not exist");
    }
  };

  const deleteFileV2 = async (path) => {
    try {
      await unlink(path);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log("File does not exist");
      } else {
        console.log("Error deleting file");
        console.log(error);
      }
    }
  };

  const renameFile = async (oldPath, newPath) => {
    try {
      const existingFileHandler = await open(oldPath, "r");
      existingFileHandler.close();

      await rename(oldPath, newPath);
      console.log("File renamed");
    } catch (error) {
      console.log("File does not exist");
    }
  };

  const renameFileV2 = async (oldPath, newPath) => {
    try {
      await rename(oldPath, newPath);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log("File does not exist");
      } else {
        console.log("Error renaming file");
        console.log(error);
      }
    }
  };

  let addedContent;

  const addToFile = async (path, content) => {
    if (addedContent === content) return;

    try {
      const fileHandler = await open(path, "a");
      fileHandler.write(content);
      addedContent = content;

      fileHandler.close();
      console.log("Content added to file");
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log("File does not exist");
      } else {
        console.log("Error adding to file");
        console.log(error);
      }
    }
  };

  const fileHandler = await open(FILE_PATH, "r");

  fileHandler.on(EVENT_NAME, async () => {
    const fileSize = (await fileHandler.stat()).size;
    // Allocating a buffer of the right size, not wasting memory
    const buffer = Buffer.alloc(fileSize);
    const offset = 0;
    const length = buffer.byteLength;
    const position = 0;

    // Always reading the whole file, but you can read only the changes if you want
    await fileHandler.read(buffer, offset, length, position);

    // Decoder -> 0001 => meaningful
    // Encoder -> meaningful => 0001

    const readData = buffer.toString("utf-8");

    // Create a file -> create a file <path>
    if (readData.toLowerCase().includes(COMMANDS.CREATE)) {
      const path = readData.substring(COMMANDS.CREATE.length + 1);
      if (isValidPath(path)) {
        createFile(path);
      } else {
        console.log("Invalid file path");
      }
    }

    // Delete a file -> delete a file <path>
    if (readData.toLowerCase().includes(COMMANDS.DELETE)) {
      const path = readData.substring(COMMANDS.DELETE.length + 1);
      if (isValidPath(path)) {
        deleteFile(path);
      } else {
        console.log("Invalid file path");
      }
    }

    // Rename a file -> rename a file <oldPath> <newPath>
    if (readData.toLowerCase().includes(COMMANDS.RENAME)) {
      const paths = readData.substring(COMMANDS.RENAME.length + 1).split(" ");
      const oldPath = paths[0];
      const newPath = paths[1];
      if (isValidPath(oldPath) && isValidPath(newPath)) {
        renameFile(oldPath, newPath);
      } else {
        console.log("Invalid file path");
      }
    }

    // Update a file -> update a file <path> <content>
    if (readData.toLowerCase().includes(COMMANDS.UPDATE)) {
      const parts = readData.substring(COMMANDS.UPDATE.length + 1).split(" ");
      const path = parts[0];
      const content = parts[1];
      if (isValidPath(path)) {
        writeFile(path, content, (error) => {
          if (error) {
            console.log("Error writing to file");
          } else {
            console.log("File updated");
          }
        });
      } else {
        console.log("Invalid file path");
      }
    }

    // Append to a file -> append to a file <path> <content>
    if (readData.toLowerCase().includes(COMMANDS.APPEND)) {
      const parts = readData.substring(COMMANDS.APPEND.length + 1).split(" ");
      const path = parts[0];
      const content = parts[1];
      if (isValidPath(path)) {
        writeFile(path, content, { flag: "a" }, (error) => {
          if (error) {
            console.log("Error appending to file");
          } else {
            console.log("File appended");
          }
        });
      } else {
        console.log("Invalid file path");
      }
    }
  });

  const watcher = watch(FILE_PATH);
  for await (const event of watcher) {
    if (event.eventType === EVENT_NAME) {
      fileHandler.emit(EVENT_NAME);
    }
  }

  fileHandler.close();
})();
