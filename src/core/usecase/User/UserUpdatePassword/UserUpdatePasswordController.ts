import { Authorization } from '../../../../base/abstract/Authorization';
import { BaseController, ControllerProps, InjectableController } from '../../../../base/abstract/Controller';
import { Controller, Put } from '../../../../base/decorators/Controller';
import { UserUpdatePasswordDTO } from './UserUpdatePasswordDTO';
import { UserUpdatePasswordService } from './UserUpdatePasswordService';

@Controller(Authorization.Level.InsideSales)
@Put("/user/change-password")
export class UserUpdatePasswordController extends BaseController<UserUpdatePasswordService> {

  constructor(props: InjectableController<UserUpdatePasswordService>) {
    super(props)
  }

  async handle({ body, }: ControllerProps) {
    try {

      const dto = new UserUpdatePasswordDTO({ ...body, })
      return await this.service.execute(dto);
    } catch (error) {
      return this.exceptionController.handle(error)
    }
  }
}



