import { InjectableDependencies, Service } from "../../../../base/abstract/Service";
import { Provider } from "../../../../base/decorators/Provider";
import { UserException } from "../user.errors";
import { UserModule } from "../user.modules";
import { UserRepository } from './../../../repositories/UserRepository';
import { UserUpdatePrivilegeDTO } from './UserUpdatePrivilegeDTO';


interface Repositories {
  user: UserRepository,

}
interface Services { }
@Provider(UserModule)
export class UserUpdatePrivilegeService extends Service<Repositories, Services> {
  constructor(props: InjectableDependencies<Repositories, Services>) {
    super(props)
  }

  private ensureDontChangeMyOwnPrivilege(dto: UserUpdatePrivilegeDTO) {
    if (dto.user_id === dto.me.id) {
      throw new UserException.UnauthorizedToUpdateRoles("Você não pode alterar o próprio cargo!")
    }
  }
  private ensureAskedPrivilegeIsLowerThanMyOwnPrivilege(dto: UserUpdatePrivilegeDTO) {
    if (dto.privilege >= dto.me.privilege) {
      throw new UserException.UnauthorizedToUpdateRoles()
    }
  }


  async execute(dto: UserUpdatePrivilegeDTO) {
    this.ensureDontChangeMyOwnPrivilege(dto)
    this.ensureAskedPrivilegeIsLowerThanMyOwnPrivilege(dto)
    const user = await this.repository.user.findUnique({ where: { id: dto.user_id } })
    user.update({ ...dto })
    await this.repository.user.update(user)
  }


}