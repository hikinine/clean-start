import { BaseController, ControllerProps, InjectableController } from '../../../../base/abstract/Controller';
import { Controller, Put } from '../../../../base/decorators/Controller';
import { UserUpdatePrivilegeDTO } from './UserUpdatePrivilegeDTO';
import { UserUpdatePrivilegeService } from './UserUpdatePrivilegeService';
@Controller()
@Put("/user/privilege")
export class UserUpdatePrivilegeController extends BaseController<UserUpdatePrivilegeService> {

  constructor(props: InjectableController<UserUpdatePrivilegeService>) {
    super(props)
  }

  async handle({ body }: ControllerProps) {
    try {
      const dto = new UserUpdatePrivilegeDTO({ ...body })
      return await this.service.execute(dto);
    } catch (error) {
      return this.exceptionController.handle(error)
    }
  }
}



