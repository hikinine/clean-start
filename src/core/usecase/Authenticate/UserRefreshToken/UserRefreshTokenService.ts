import { InjectableDependencies, Service } from "../../../../base/abstract/Service";
import { Provider } from "../../../../base/decorators/Provider";
import { UserAuthenticate } from '../../../domain/entities/UserAuthenticate';
import { RefreshToken } from '../../../domain/entities/UserRefreshToken';
import { RefreshTokenRepository } from './../../../repositories/RefreshTokenRepository';
import { UserRepository } from './../../../repositories/UserRepository';
import { AuthenticateModule } from './../authenticate.modules';
import { UserRefreshTokenDTO } from './UserRefreshTokenDTO';


interface Repositories {
  refresh_token: RefreshTokenRepository,
  user: UserRepository,

}
interface Services { }
@Provider(AuthenticateModule)
export class UserRefreshTokenService extends Service<Repositories, Services> {
  constructor(props: InjectableDependencies<Repositories, Services>) {
    super(props)
  }

  async execute(dto: UserRefreshTokenDTO) {
    const { sub: user_id } = UserAuthenticate.decodeIn(dto.access_token)
    const thisRefreshToken = new RefreshToken({ id: dto.refresh_token, user_id });

    const [user, { id: refresh_token }] = await Promise.all([
      this.repository.user.findUnique({ where: { id: user_id } }),
      this.repository.refresh_token.check(thisRefreshToken),
    ])

    const { access_token, payload } = new UserAuthenticate(user, { expiresIn: UserAuthenticate.DEFAULT_EXPIRES_IN })
    return { access_token, payload, refresh_token }
  }
}