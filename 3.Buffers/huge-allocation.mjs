import { Buffer, constants } from "node:buffer";
import { log } from "node:console";

const buffer = Buffer.alloc(1e9); // 1GB

log("buffer.length is the size of the buffer in bytes");
log("MAX_LENGTH: ", constants.MAX_LENGTH);
log("MAX_STRING_LENGTH: ", constants.MAX_STRING_LENGTH);

setInterval(() => {
  //for (let i = 0; i < buffer.length; i++) {
  //b[i] = 0x22;
  //}

  buffer.fill(0x22);
}, 10000);
