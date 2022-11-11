import { InjectableDependencies, Service } from "../../../../base/abstract/Service";
import { Provider } from "../../../../base/decorators/Provider";
import { User } from '../../../domain/entities/User';
import { UserModule } from "../user.modules";
import { RefreshTokenRepository } from './../../../repositories/RefreshTokenRepository';
import { UserRepository } from './../../../repositories/UserRepository';
import { UserException } from './../user.errors';
import { UserCreateDTO } from './UserCreateDTO';
interface Repositories {
  refresh_token: RefreshTokenRepository,
  user: UserRepository,

}
interface Services { }
@Provider(UserModule)
export class UserCreateService extends Service<Repositories, Services> {
  constructor(props: InjectableDependencies<Repositories, Services>) {
    super(props)
  }

  async execute(dto: UserCreateDTO) {
    const users = await this.repository.user.findAll({
      where: { email: dto.email },
      take: 1
    });

    if (users.total > 0) {
      throw new UserException.AlreadyExists()
    }
    
    const user = new User(dto);
    user.encryptPassword()
    await this.repository.user.create(user)
  }
}