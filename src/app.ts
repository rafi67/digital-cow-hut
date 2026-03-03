import express, { Application } from "express";
import cors from "cors";
import routes from "./app/routes/index.routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import handleNotFound from "./errors/handleNotFound";

const app: Application = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routes);

app.use(globalErrorHandler);

app.use(handleNotFound);

export default app;
