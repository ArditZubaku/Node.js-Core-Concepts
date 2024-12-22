import { log } from "node:console";
import { readFileSync } from "node:fs";

const content = readFileSync("./text.txt");

log(content);
log(content.toString("utf-8"));

