import { InjectableDependencies, Service } from "../../../../base/abstract/Service";
import { Provider } from "../../../../base/decorators/Provider";
import { UserModule } from "../user.modules";
import { UserRepository } from './../../../repositories/UserRepository';
import { UserUpdateOwnProfileDTO } from './UserUpdateOwnProfileDTO';


interface Repositories {
  user: UserRepository,

}
interface Services { }
@Provider(UserModule)
export class UserUpdateOwnProfileService extends Service<Repositories, Services> {
  constructor(props: InjectableDependencies<Repositories, Services>) {
    super(props)
  }

  async execute(dto: UserUpdateOwnProfileDTO) {
    const user = await this.repository.user.findUnique({ where: { id: dto.me.id } })
    user.update(dto)
    await this.repository.user.update(user)
  }
}