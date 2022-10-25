import { Router } from "express";
import { ensureAuthenticated } from "../middleware"
import * as Routes from "./_routes"

const route = Router();

route.get("/", (req, res) => res.json({ message: "Bem vindo" }))
route.use("/authenticate", Routes.authenticate)
route.use("/user", Routes.user)

export { route };
