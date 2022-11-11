import { InjectableDependencies, Service } from "../../../../base/abstract/Service";
import { Provider } from "../../../../base/decorators/Provider";
import { UserRepository } from './../../../repositories/UserRepository';
import { UserModule } from './../user.modules';
import { UserViewOwnProfileDTO } from './UserViewOwnProfileDTO';


interface Repositories {
  user: UserRepository,

}
interface Services { }


@Provider(UserModule)
export class UserViewOwnProfileService extends Service<Repositories, Services> {
  constructor(props: InjectableDependencies<Repositories, Services>) {
    super(props)
  }

  async execute(dto: UserViewOwnProfileDTO) {
    const user = await this.repository.user.findUnique({ where: { id: dto.me.id } })
    return user.toPublicView()
  }
}