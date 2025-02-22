import express from 'express';
import path from "path";
import cors from "cors";
import "express-async-errors";

import "./database/connection";
import router from "./routes";
let port = process.env.PORT || 8080;
import errorHandler from "./errors/handle";

const app = express();

app.use(cors())

app.use(express.json())
app.use(router)
app.use("/uploads", express.static(path.join(__dirname,"..","uploads")))
app.use(errorHandler)


app.listen(port);