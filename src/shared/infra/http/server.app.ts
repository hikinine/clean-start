import express from "express";
import bodyParser from 'body-parser'

import { config } from "../config";
import { route } from "./routes/_index";
import cors from "cors"

const app = express();
app.use((bodyParser as any).json({extended: true}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '50mb'})) // and add this
app.use(bodyParser.urlencoded({limit: '50mb'})) // and add this
app.use(cors());


app.use(config.apiVersion, route);
app.listen(config.httpPort, config.httpOnReady);
