import mongoose from "mongoose";
import config from "./config/index";
import { Server } from "http";
import app from "./app";

process.on("uncaughtException", (error) => {
  console.log(error);
  process.exit(1);
});

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

  process.on("unhandledRejection", (error) => {
    console.log(
      "Unhandled Rejection is detected, we are closing our server.....",
    );

    if (server) {
      server.close(() => {
        console.log("Failed to connect database", error);
        process.exit(1);
      });
    } else process.exit(1);
  });
}

main();

process.on("SIGTERM", () => {
  console.log("SIGTERM is received");
  if (server) {
    server.close();
  }
});
