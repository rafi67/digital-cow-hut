"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = __importDefault(require("./config/index"));
const app_1 = __importDefault(require("./app"));
process.on("uncaughtException", (error) => {
    console.log(error);
    process.exit(1);
});
let server;
async function main() {
    try {
        await mongoose_1.default.connect(index_1.default.database_url, {
            dbName: "digitalCowHut",
        });
        console.log("Database is connected successfully");
        server = app_1.default.listen(index_1.default.port, () => {
            console.log(`listening port ${index_1.default.port}`);
        });
    }
    catch (err) {
        console.log(`failed to connect database ${err.message}`);
    }
    process.on("unhandledRejection", (error) => {
        console.log("Unhandled Rejection is detected, we are closing our server.....");
        if (server) {
            server.close(() => {
                console.log("Failed to connect database", error);
                process.exit(1);
            });
        }
        else
            process.exit(1);
    });
}
main();
process.on("SIGTERM", () => {
    console.log("SIGTERM is received");
    if (server) {
        server.close();
    }
});
