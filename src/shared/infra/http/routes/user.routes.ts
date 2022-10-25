import { userUpdateController } from "./../../../../core/usecase/UserUpdate/index";
import { userCreateController } from "./../../../../core/usecase/UserCreate/index";
import { Router } from "express";
import { bind } from "../middleware/bind";
const route = Router()


export { route as user }

route.post("/", bind(userCreateController))
route.put("/", bind(userUpdateController))