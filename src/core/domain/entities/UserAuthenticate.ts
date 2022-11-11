import { decode, JwtPayload, sign, verify } from 'jsonwebtoken';

import { AuthenticationException } from '../../../base/errors';
import { config } from '../../../shared/infra/config';
import { User } from './User';

export class UserAuthenticate {
  static DEFAULT_EXPIRES_IN = "12h"

  public access_token: string
  public payload: Partial<User>
  private options: { subject: string, expiresIn: string | number }

  signIn() {
    return sign(this.payload, config.jwtSecretKey, this.options)
  }

  static verifyIn(accessToken: string) {
    return verify(accessToken, config.jwtSecretKey) as JwtPayload
  }

  static decodeIn(accessToken: string) {
    const decoded = decode(accessToken, { json: true })

    if (!decoded)
      throw new AuthenticationException(`Invalid JWT decode`)

    return decoded
  }

  constructor(user: User, options: { expiresIn: number | string }) {
    this.payload = {
      id: user.id,
      privilege: user.privilege,
    }
    this.options = {
      subject: user.id,
      expiresIn: options.expiresIn
    }

    this.access_token = this.signIn()
  }

}