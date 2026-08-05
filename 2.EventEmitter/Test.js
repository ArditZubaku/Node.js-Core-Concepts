import {myEventEmitter} from "./eventEmitter.mjs";

export class Test {
    static test() {
        myEventEmitter.on("ardit", () => {
            console.log("Ardit QETU");
        });
    }
}
