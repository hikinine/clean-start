import { UserUpdateDTO } from './UserUpdateDTO';
import { Service, InjectableDependencies } from "../../../base/abstract/Service"
import { Authorization } from '../../../base/abstract/Authorization';
import { UserRepository } from './../../repositories/UserRepository';


interface Repositories {
  user: UserRepository,
  
}
interface Services {}

export class UserUpdateService extends Service<Repositories, Services> {
  constructor(props: InjectableDependencies<Repositories, Services>) {
    super(props)

    this.setAuthorization({
      role: Authorization.Role.User,
      level: Authorization.Level.Free
    })
  }

  async execute(dto: UserUpdateDTO) {
    
  }
}