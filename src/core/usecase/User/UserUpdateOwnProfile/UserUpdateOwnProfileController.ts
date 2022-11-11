import { BaseController, ControllerProps, InjectableController } from '../../../../base/abstract/Controller';
import { Controller, Put } from '../../../../base/decorators/Controller';
import { UserUpdateOwnProfileDTO } from './UserUpdateOwnProfileDTO';
import { UserUpdateOwnProfileService } from './UserUpdateOwnProfileService';


@Controller()
@Put("/user")
export class UserUpdateOwnProfileController extends BaseController<UserUpdateOwnProfileService> {

  constructor(props: InjectableController<UserUpdateOwnProfileService>) {
    super(props)
  }

  async handle({ body }: ControllerProps) {
    try {
      const dto = new UserUpdateOwnProfileDTO({ ...body })
      return await this.service.execute(dto);
    } catch (error) {
      return this.exceptionController.handle(error)
    }
  }
}



