import { RefreshToken } from './../../domain/entities/UserRefreshToken';
import { UserAuthenticate } from './../../domain/entities/UserAuthenticate';
import { UserRefreshTokenDTO } from './UserRefreshTokenDTO';
import { Service, InjectableDependencies } from "../../../base/abstract/Service"
import { Authorization } from '../../../base/abstract/Authorization';
import { UserRepository } from './../../repositories/UserRepository';
import { RefreshTokenRepository } from './../../repositories/RefreshTokenRepository';
import { User } from '../../domain/entities/User';


interface Repositories {
  user: UserRepository,
  refreshtoken: RefreshTokenRepository,

}
interface Services { }

export class UserRefreshTokenService extends Service<Repositories, Services> {
  constructor(props: InjectableDependencies<Repositories, Services>) {
    super(props)

    this.setAuthorization({
      role: Authorization.Role.User,
      level: Authorization.Level.Basic
    })
  }

  async execute(dto: UserRefreshTokenDTO) {

    const { sub: userId } = UserAuthenticate.decodeIn(dto.accessToken)
    const thisRefreshToken = new RefreshToken({ id: dto.refreshToken, userId });

    const [user, { id: refreshToken }] = await Promise.all([
      this.repository.user.findUnique({ where: { id: userId } }),
      this.repository.refreshtoken.check(thisRefreshToken),
    ])

    const { accessToken, payload } = new UserAuthenticate(user, { expiresIn: User.DEFAULT_EXPIRES_IN })
    return { accessToken, payload, refreshToken }
  }
}