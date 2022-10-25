import { User } from './User';
import { sign, decode, verify, JwtPayload } from 'jsonwebtoken';
import { AuthenticationException } from '../../../base/errors';
import { config } from '../../../shared/infra/config';
export class UserAuthenticate {
  public accessToken: string
  public payload: Partial<User>
  private options: { subject: string, expiresIn: string | number }

  signIn() {
    return sign(this.payload, config.jwtSecretKey, this.options)
  }

  verifyIn(accessToken: string) {
    return verify(accessToken, config.jwtSecretKey) as JwtPayload
  }

  decodeIn(accessToken: string) {
    const decoded = decode(accessToken, { json: true })

    if (!decoded)
      throw new AuthenticationException(`Invalid JWT decode`)

    return decoded
  }

  constructor(user: User, options: { expiresIn: number | string }) {
    this.payload = {
      id: user.id,
      privilege: user.privilege,
      role: user.role
    }
    this.options = {
      subject: user.id,
      expiresIn: options.expiresIn
    }

    this.accessToken = this.signIn()
  }

}