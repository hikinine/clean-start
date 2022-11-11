import { InjectableDependencies, Service } from "../../../../base/abstract/Service";
import { Provider } from "../../../../base/decorators/Provider";
import { UserAuthenticate } from '../../../domain/entities/UserAuthenticate';
import { RefreshToken } from '../../../domain/entities/UserRefreshToken';
import { RefreshTokenRepository } from '../../../repositories/RefreshTokenRepository';
import { UserRepository } from '../../../repositories/UserRepository';
import { AuthenticateModule } from "../authenticate.modules";
import { UserLoginAuthenticateDTO } from './UserLoginAuthenticateDTO';
interface Repositories {
  user: UserRepository,
  refresh_token: RefreshTokenRepository,
}
interface Services {
}
@Provider(AuthenticateModule)
export class UserLoginAuthenticateService extends Service<Repositories, Services> {

  constructor(props: InjectableDependencies<Repositories, Services>) {
    super(props)
  }

  async execute(dto: UserLoginAuthenticateDTO) {

    const user = await this.repository.user.findUnique({
      where: { email: dto.email },
      include: { refresh_token: true }
    });

    user.ensureEncryptedPasswordMatchWith(dto.password);
    const { payload, access_token } = new UserAuthenticate(user, { expiresIn: UserAuthenticate.DEFAULT_EXPIRES_IN });

    let refresh_token_id = user.refresh_token?.id

    if (!user.hasRefreshToken()) {
      const refresh_token = new RefreshToken({
        id: RefreshToken.generateRandom48bitsToken(),
        user_id: user.id
      });

      await this.repository.refresh_token.create(refresh_token)

      refresh_token_id = refresh_token.id
    }

    return { payload, access_token, refresh_token: refresh_token_id }
  }
}