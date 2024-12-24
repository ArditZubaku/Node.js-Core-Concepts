// Callback API - the fastest
// Stay away from the synchronous API unless you are reading from a config file

import { log } from "node:console";
import { copyFile as copyFileAsync } from "node:fs/promises";
import { copyFile, copyFileSync } from "node:fs";

const filePath = "./text.txt";

// PROMISE API
(async () => {
  try {
    await copyFileAsync(filePath, "copied-promise.txt");
  } catch (err) {
    log(err);
  }
})();

// CALLBACK API
copyFile(filePath, "copied-callback.txt", (err) => {
  if (err) log(err);
});

// SYNCHRONOUS API
copyFileSync(filePath, "copied-sync.txt");
