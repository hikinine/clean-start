import { BaseController, ControllerProps, InjectableController } from '../../../../base/abstract/Controller';
import { Controller, Get } from '../../../../base/decorators/Controller';
import { UserViewOwnProfileDTO } from './UserViewOwnProfileDTO';
import { UserViewOwnProfileService } from './UserViewOwnProfileService';
@Controller()
@Get("/user/me")
export class UserViewOwnProfileController extends BaseController<UserViewOwnProfileService> {

  constructor(props: InjectableController<UserViewOwnProfileService>) {
    super(props)
  }

  async handle({ body }: ControllerProps) {
    try {
      const dto = new UserViewOwnProfileDTO({ ...body })
      return await this.service.execute(dto);
    } catch (error) {
      return this.exceptionController.handle(error)
    }
  }
}



