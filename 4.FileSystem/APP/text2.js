const fs = require("node:fs/promises");

(async () => {
    const commandFileHandler = await fs.open("./command.txt", "r");

    const watcher = fs.watch("./command2.txt")

    for await (const event of watcher) {
        if (event.eventType === "change") {
            console.log("The file was changed");

            // Get the size of the file
            const size = (await commandFileHandler.stat()).size;
            // const buffer = Buffer.alloc(size);
            // I'll use `allocUnsafe` since we are going to fill this buffer immediately
            const buffer = Buffer.allocUnsafe(size);
            const offset = 0;
            const length = buffer.byteLength;
            const position = 0;

            const content = await commandFileHandler.read(buffer, offset, length, position);
            console.log(content);

            console.log(commandFileHandler)

            // Reads the whole file, but I'd rather use `read` to read in chunks
            const fileRead = await fs.readFile("./command2.txt");
            // ReadFile will start reading from the position where the fileHandler is
            const fileRead2 = await fs.readFile(commandFileHandler, {encoding: "utf-8"});
            const fileRead3 = await fs.readFile(commandFileHandler);
            console.log("ByteLength: ", fileRead.byteLength);
            console.log("Length: ", fileRead.length);
            console.log("VALUE: ", fileRead.toString("utf-8"));
            console.log("VALUE2: ", fileRead2);
            console.log("VALUE3: ", fileRead3);
        } else {
            break;
        }
    }

    await commandFileHandler.close();
})();
