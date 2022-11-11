import { BaseController, InjectableController } from '../../../../base/abstract/Controller';
import { Controller, Post } from '../../../../base/decorators/Controller';
import { ControllerProps } from './../../../../base/abstract/Controller';
import { UserLoginAuthenticateDTO } from './UserLoginAuthenticateDTO';
import { UserLoginAuthenticateService } from './UserLoginAuthenticateService';

@Controller()
@Post("/authenticate/login", true)
export class UserLoginAuthenticateController extends BaseController<UserLoginAuthenticateService> {

  constructor(props: InjectableController<UserLoginAuthenticateService>) {
    super(props)
  }
  async handle({ body, params }: ControllerProps) {
    try {
      const dto = new UserLoginAuthenticateDTO({ ...body })
      return await this.service.execute(dto);
    } catch (error) {
      return this.exceptionController.handle(error)
    }
  }
}