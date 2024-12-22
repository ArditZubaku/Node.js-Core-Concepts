import { Buffer } from "node:buffer";
import { log } from "node:console";

const poolSize = Buffer.poolSize;
log(poolSize >>> 1); // basically dividing by 2

const fastest = Buffer.allocUnsafe(poolSize >>> 1);
const slow = Buffer.allocUnsafeSlow(1_000); // Slow - because it won't try to make use of the pre-allocated  Buffer by Node.js

const buffer = Buffer.alloc(10_000, 0); // by default it fills with 0

const unsafeBuffer = Buffer.allocUnsafe(10_000); // faster because it doesn't fill, doesn't touch the existing data

for (let i = 0; i < unsafeBuffer.length; i++) {
  if (unsafeBuffer[i] !== 0) {
    // When calling toString() on a number you can set the base
    log(`Element at position ${i} has value: ${unsafeBuffer[i].toString(2)}`);
  }
}

const concattedBuffer = Buffer.concat([Buffer.from([1, 2, 3]), buffer, unsafeBuffer]);
log(concattedBuffer);
