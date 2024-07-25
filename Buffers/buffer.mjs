import { Buffer } from "node:buffer";
import { log } from "node:console";

const memoryContainer = Buffer.alloc(4); // 4 bytes - 32 bits
log(memoryContainer);
log(memoryContainer.at(0));
log(memoryContainer[1]);

memoryContainer[0] = 0xF4;
memoryContainer[1] = 0b11110100;
memoryContainer.writeInt8(-34, 2);
//memoryContainer.writeUint8(-34, 3);
memoryContainer.writeUint8(34, 3);

log(memoryContainer.readInt8(2));
log(memoryContainer.readUint8(3));
log(memoryContainer.readInt8(3));
log(memoryContainer);

log(memoryContainer.toString("hex"));
log(memoryContainer.toString("base64"));
log(memoryContainer.toString("ascii"));
log(memoryContainer.toString("utf-8"));
log(memoryContainer.toString("binary"));

log(Buffer.from([0x48, 0x69, 0x21]).toString("utf-8"));
log(Buffer.from([0x48, 105, 0x21]).toString("utf-8"));
log(Buffer.from("486921", "hex").toString("utf-8"));
log(Buffer.from("word", "utf-8"));

