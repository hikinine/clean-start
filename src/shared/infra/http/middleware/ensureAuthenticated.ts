import { AuthenticationException } from './../../../../base/errors/AuthenticationException';
import { config } from './../../config';
import { Request, Response, NextFunction } from "express"
import { JwtPayload, verify } from "jsonwebtoken"

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
  try {
    const authToken = request.headers.authorization

    if (!authToken) {
      throw new AuthenticationException("Falha na autenticação do seu token.")
    }

    const [, access_token] = authToken.split(" ")

    if (!access_token) {
      throw new AuthenticationException("Falha na autenticação do seu token.")
    }

    try {

      const verified = verify(access_token, config.jwtSecretKey) as JwtPayload
      request.body = {
        ...request.body,
        me: {
          ...verified,
          id: verified.sub,
          iat: undefined,
          exp: undefined,
          sub: undefined
        }
      }

      next()
    }
    catch (error) {
      return response.status(401).json({
        message: `Token de acesso invalido`,
        routine: `EnsureAuthenticated`
      })
    }

  } catch (error) {
    return response.status(401).json({
      message: `Token de acesso invalido`,
      routine: `EnsureAuthenticated`
    })
  }
}