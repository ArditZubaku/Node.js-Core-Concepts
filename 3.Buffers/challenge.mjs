// 0100 1000 0110 1001 0010 0001

import { Buffer } from "node:buffer";
import { log } from "node:console";

const mem = Buffer.alloc(3);
mem[0] = 0b01001000;
mem[1] = 0b01101001;
mem[2] = 0b00100001;

log(mem.toString("utf-8"));
log(mem.toString("utf8"));
