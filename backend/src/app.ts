import express from 'express';
import cors from "cors";
import routes from "./routes";
import path from "path";
import {errorMiddleware} from "./shared/middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(errorMiddleware);

export default app;
