import { Router } from "express";
import { bind } from "../middleware/bind";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated";
import { userLoginAuthenticateController } from "../../../../core/usecase/UserLoginAuthenticate";
const route = Router()

route.post("/login", bind(userLoginAuthenticateController))

export { route as authenticate }  