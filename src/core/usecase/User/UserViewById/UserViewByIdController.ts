import { BaseController, ControllerProps, InjectableController } from '../../../../base/abstract/Controller';
import { Controller, Get } from '../../../../base/decorators/Controller';
import { UserViewByIdDTO } from './UserViewByIdDTO';
import { UserViewByIdService } from './UserViewByIdService';
@Controller()
@Get("/user/:user_id")
export class UserViewByIdController extends BaseController<UserViewByIdService> {

  constructor(props: InjectableController<UserViewByIdService>) {
    super(props)
  }

  async handle({ body, params }: ControllerProps) {
    try {

      const { user_id } = params

      const dto = new UserViewByIdDTO({ ...body, user_id })
      return await this.service.execute(dto);
    } catch (error) {
      return this.exceptionController.handle(error)
    }
  }
}



