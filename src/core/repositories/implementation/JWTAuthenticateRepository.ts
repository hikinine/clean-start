import { JwtPayload } from 'jsonwebtoken';
import { AuthenticationException } from '../../../base/errors/AuthenticationException';
import jwt, { sign, SignOptions, verify, decode } from 'jsonwebtoken';
import { config } from '../../../shared/infra/config';
import { AuthenticateRepository } from '../AuthenticateRepository';

export class JWTAuthenticateRepository implements AuthenticateRepository {
  // eslint-disable-next-line no-use-before-define
  private static instance: JWTAuthenticateRepository;

  private constructor() {}

  public static getInstance() {
    if (!JWTAuthenticateRepository.instance) {
      JWTAuthenticateRepository.instance = new JWTAuthenticateRepository();
    }
    return JWTAuthenticateRepository.instance;
  }
 
  signIn(user: any, options: SignOptions) {
    return sign(user, config.jwtSecretKey, options)
  }

  verifyIn(access_token: string) {
    return verify(access_token, config.jwtSecretKey) as JwtPayload
  } 

  decodeIn(access_token: string) {
    const decoded = decode(access_token, {
      json: true
    })

    if (!decoded ) 
      throw new AuthenticationException(`Invalid JWT decode`)

    return decoded
  } 
}
