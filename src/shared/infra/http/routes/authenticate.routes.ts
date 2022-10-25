import { Router } from "express";
import { bind } from "../middleware/bind";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated";
import { userLoginAuthenticateController } from "../../../../core/usecase/UserLoginAuthenticate";
import { userRefreshTokenController } from "../../../../core/usecase/UserRefreshToken";
const route = Router()

route.post("/login", bind(userLoginAuthenticateController))
route.post("/refresh-token", bind(userRefreshTokenController))

export { route as authenticate }  