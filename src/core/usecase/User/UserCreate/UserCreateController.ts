import { BaseController, ControllerProps, InjectableController } from '../../../../base/abstract/Controller';
import { Controller, Post } from '../../../../base/decorators/Controller';
import { UserCreateDTO } from './UserCreateDTO';
import { UserCreateService } from './UserCreateService';

@Controller()
@Post("/user")
export class UserCreateController extends BaseController<UserCreateService> {

  constructor(props: InjectableController<UserCreateService>) {
    super(props)
  }

  async handle({ body, }: ControllerProps) {
    try {
      const dto = new UserCreateDTO({ ...body, })
      return await this.service.execute(dto);
    } catch (error) {
      return this.exceptionController.handle(error)
    }
  }
}



