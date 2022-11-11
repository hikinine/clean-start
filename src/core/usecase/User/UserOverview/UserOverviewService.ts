import { Query } from "../../../../base/abstract/QueryPagination";
import { InjectableDependencies, Service } from "../../../../base/abstract/Service";
import { Provider } from "../../../../base/decorators/Provider";
import { UserModule } from "../user.modules";
import { UserRepository } from './../../../repositories/UserRepository';
import { UserOverviewDTO } from './UserOverviewDTO';


interface Repositories {
  user: UserRepository,

}
interface Services { }
@Provider(UserModule)
export class UserOverviewService extends Service<Repositories, Services> {
  constructor(props: InjectableDependencies<Repositories, Services>) {
    super(props)
  }

  async execute(dto: UserOverviewDTO) {
    const options = new Query(dto.query)
    const users = await this.repository.user.findAll(options, { raw: true })
    return {
      total: users.total,
      payload: users.payload.map(user => ({ ...user, password: undefined }))
    }
  }
}