import { InjectableDependencies, Service } from "../../../../base/abstract/Service";
import { Provider } from "../../../../base/decorators/Provider";
import { UserModule } from "../user.modules";
import { RefreshToken } from './../../../domain/entities/UserRefreshToken';
import { RefreshTokenRepository } from './../../../repositories/RefreshTokenRepository';
import { UserRepository } from './../../../repositories/UserRepository';
import { UserUpdatePasswordDTO } from './UserUpdatePasswordDTO';


interface Repositories {
  refresh_token: RefreshTokenRepository,
  user: UserRepository,

}
interface Services { }
@Provider(UserModule)
export class UserUpdatePasswordService extends Service<Repositories, Services> {
  constructor(props: InjectableDependencies<Repositories, Services>) {
    super(props)
  }

  async execute(dto: UserUpdatePasswordDTO) {
    const user = await this.repository.user.findUnique({ where: { id: dto.me.id } })

    user.ensureEncryptedPasswordMatchWith(dto.old_password);
    user.update({ ...dto })
    user.encryptPassword()

    const refresh_token = new RefreshToken({
      user_id: user.id,
      id: RefreshToken.generateRandom48bitsToken()
    })

    await Promise.all([
      this.repository.refresh_token.revokeFrom(user.id),
      this.repository.refresh_token.create(refresh_token),
      this.repository.user.update(user)
    ])

  }
}