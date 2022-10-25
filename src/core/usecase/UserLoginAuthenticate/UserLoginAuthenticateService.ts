import { UserAuthenticate } from './../../domain/entities/UserAuthenticate';
import { UserCreateService } from './../UserCreate/UserCreateService';
import { RefreshToken } from './../../domain/entities/UserRefreshToken';
import { UserLoginAuthenticateDTO } from './UserLoginAuthenticateDTO';
import { Service, InjectableDependencies } from "../../../base/abstract/Service"
import { User } from '../../domain/entities/User';
import { Authorization } from '../../../base/abstract/Authorization';
import { UserRepository } from './../../repositories/UserRepository';
import { RefreshTokenRepository } from './../../repositories/RefreshTokenRepository';
interface Repositories {
  user: UserRepository,
  refreshToken: RefreshTokenRepository,
}
interface Services {
  userCreate: UserCreateService
}
export class UserLoginAuthenticateService extends Service<Repositories, Services> {

  constructor(props: InjectableDependencies<Repositories, Services>) {
    super(props)

    this.setAuthorization({
      role: Authorization.Role.User,
      level: Authorization.Level.Admin
    })
  }

  async execute(dto: UserLoginAuthenticateDTO) {

    const user = await this.repository.user.findUnique({
      where: { email: dto.email },
      include: { refreshToken: true }
    });

    user.ensureEncryptedPasswordMatchWith(dto.password);
    const { payload, accessToken } = new UserAuthenticate(user, { expiresIn: User.DEFAULT_EXPIRES_IN });
    
    let refreshTokenId: string

    if (!user.hasRefreshToken()) {
      const refreshToken = new RefreshToken({
        id: RefreshToken.generateRandom48bitsToken(),
        userId: user.id
      });

      await this.repository.refreshToken.createRefreshToken(refreshToken)

      refreshTokenId = refreshToken.id
    }

    return { payload, accessToken, refreshToken: refreshTokenId }
  }
}