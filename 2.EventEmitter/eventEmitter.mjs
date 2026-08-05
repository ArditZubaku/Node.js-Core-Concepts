// log("Remember, this is just a pattern.\n");
//
// import { log } from "console";
// import { EventEmitter } from "events";
//
// class Emitter extends EventEmitter {}
//
// const myEmitter = new Emitter();
// const event = "test";
//
// myEmitter.on(event, () => {
//   log("An event occurred 1.");
// });
//
// myEmitter.on(event, () => {
//   log("An event occurred 2.");
// });
//
// myEmitter.on(event, (param) => {
//   log("An event with a parameter occurred.");
//   log(`${param}\n`);
// });
// myEmitter.emit(event);
// myEmitter.emit(event, "Some parameter");
//
// myEmitter.once("once", () => {
//   log("This is gonna run only once, no matter how many times you emit it.\n");
// });
// myEmitter.emit("once");
// myEmitter.emit("once");
// myEmitter.emit("once");
// myEmitter.emit("once");
// myEmitter.emit("once");
// myEmitter.emit("once");
// myEmitter.emit("once");
//
// const testEmitter = new EventEmitter();
// testEmitter.on("test-emitter", () => {
//   log("Test Emitter\n");
// });
//
// testEmitter.emit("test-emitter");

import { EventEmitter as MyEventEmitter } from "./implementingEventEmitter.mjs";

export const myEventEmitter = new MyEventEmitter();

myEventEmitter.on("myEventEmitter", () => {
  log("Testing custom class 2.EventEmitter");
});

// myEventEmitter.emit("myEventEmitter");
// myEventEmitter.emit("myEventEmitter");
// myEventEmitter.emit("myEventEmitter");
// myEventEmitter.emit("myEventEmitter");
// myEventEmitter.emit("myEventEmitter");
// myEventEmitter.emit("myEventEmitter");
// myEventEmitter.emit("myEventEmitter");
// myEventEmitter.emit("myEventEmitter");
// myEventEmitter.emit("myEventEmitter");
// myEventEmitter.emit("myEventEmitter");
// myEventEmitter.emit("myEventEmitter");
// myEventEmitter.emit("myEventEmitter");
// myEventEmitter.emit("myEventEmitter");

import { Test } from "./Test.js";

myEventEmitter.emit("ardit");
Test.test();
