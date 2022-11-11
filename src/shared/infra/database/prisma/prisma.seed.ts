import "reflect-metadata";
import { v4 } from 'uuid';
import { AuthenticateModule } from "../../../../core/usecase/Authenticate/authenticate.modules";
import { UserModule } from "../../../../core/usecase/User/user.modules";
import { UserCreateDTO } from '../../../../core/usecase/User/UserCreate/UserCreateDTO';
import { UserCreateService } from '../../../../core/usecase/User/UserCreate/UserCreateService';
import { ApplicationContainer } from '../../../container/application.container';
import { Service } from './../../../../base/interface/container';




async function seed() {
  const container = new ApplicationContainer([
    UserModule,
    AuthenticateModule
  ]);

  container.installModules()

  const userCreateService: Service = container.resolve(UserCreateService)

  if (!userCreateService) {
    throw new Error("Não consegui resolver o serviço de criar usuário")
  }
  const dto = new UserCreateDTO({
    email: "teste@teste.com",
    name: "Administrador",
    password: "12345678",
    me: { privilege: 10, id: v4() }
  })

  try {
    await userCreateService.execute(dto)
  } catch (error) {
    console.log(error)
  }
}




seed()