import { User } from './User';
import { Entity } from "../../../base/abstract/Entity"
import { EntityProps, NonRelationship } from "../interface/entities.contract"
import { randomBytes } from 'crypto';
import { SignOptions, sign, decode, verify, JwtPayload} from 'jsonwebtoken';
import { AuthenticationException } from '../../../base/errors';
import { config } from '../../../shared/infra/config';
export class UserAuthenticate {

  signIn(user: Partial<User>, options: SignOptions) {
    return sign(user, config.jwtSecretKey, options)
  }

  verifyIn(accessToken: string) {
    return verify(accessToken, config.jwtSecretKey) as JwtPayload
  } 

  decodeIn(accessToken: string) {
    const decoded = decode(accessToken, { json: true})

    if (!decoded ) 
      throw new AuthenticationException(`Invalid JWT decode`)

    return decoded
  } 
}