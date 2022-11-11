import { InjectableDependencies, Service } from "../../../../base/abstract/Service";
import { Provider } from "../../../../base/decorators/Provider";
import { UserModule } from "../user.modules";
import { UserRepository } from './../../../repositories/UserRepository';
import { UserViewByIdDTO } from './UserViewByIdDTO';


interface Repositories {
  user: UserRepository,

}
interface Services { 
  
}

@Provider(UserModule)
export class UserViewByIdService extends Service<Repositories, Services> {
  constructor(props: InjectableDependencies<Repositories, Services>) {
    super(props)
  }

  async execute(dto: UserViewByIdDTO) {
    const user = await this.repository.user.findUnique({ where: { id: dto.user_id } })
    return user.toPublicView()
  }
}