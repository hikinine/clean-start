import { User } from './../../domain/entities/User';
import { InvalidQueryException } from './../../../base/errors/InvalidQueryException';
import { UserCreateDTO } from './UserCreateDTO';
import { Service, InjectableDependencies } from "../../../base/abstract/Service"
import { Authorization } from '../../../base/abstract/Authorization';
import { UserRepository } from './../../repositories/UserRepository';


interface Repositories {
  user: UserRepository
}
interface Services { }

export class UserCreateService extends Service<Repositories, Services> {

  constructor(props: InjectableDependencies<Repositories, Services>) {
    super(props)
    this.setAuthorization({
      role: Authorization.Role.User,
      level: Authorization.Level.Admin
    })
  }

  async execute(dto: UserCreateDTO) {
    const users = await this.repository.user.findAll({ where: { email: dto.email } });

    if (users.total > 0) {
      throw new InvalidQueryException("Já existe um usuário com esse email cadastrado.")
    }

    const user = new User(dto);
    await this.repository.user.create(user)
    return { message: "Usuário registrado com sucesso!" }
  }

}