import express from "express";
import "express-async-errors";
import http from "http";
import cors from "cors";
import path from "path";

import { router as authRouter } from "./routes/auth";
import { router as deviceRouter } from "./routes/device";
import { router as detectionsRouter } from "./routes/footage";
import { router as viewRouter } from "./routes/views";

import { auth } from "./middleware/auth";

import { PORT } from "./constant";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";

const app = express();
const server = http.createServer(app);

app.use(cors());

app.use("/", express.static(path.join(process.cwd(), "public")));
app.use('/videos', express.static(path.join(process.cwd(), "videos")));

app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(express.json({limit: "50mb"}));

app.use("/", viewRouter);
app.use("/auth", authRouter);

app.use(auth);
app.use("/api/devices", deviceRouter);
app.use("/footages", detectionsRouter);

app.use(notFound);
app.use(errorHandler);

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})  