import mongoose from "mongoose";
import config from "./config/index";
import { Server } from "http";
import app from "./app";

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string, {
      dbName: "digitalCowHut",
    });
    console.log("Database is connected successfully");
    server = app.listen(config.port, () => {
      console.log(`listening port ${config.port}`);
    });
  } catch (err) {
    console.log(`failed to connect database ${err.message}`);
  }
}

main();
