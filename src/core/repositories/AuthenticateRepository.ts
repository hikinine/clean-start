import { JwtPayload, SignOptions } from "jsonwebtoken"

export interface AuthenticateRepository {
  signIn(user: any, options: SignOptions): string
  verifyIn(access_token: string):  JwtPayload
  decodeIn(access_token: string):  JwtPayload 
}
