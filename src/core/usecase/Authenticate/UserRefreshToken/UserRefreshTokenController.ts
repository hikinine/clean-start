import { BaseController, ControllerProps, InjectableController } from '../../../../base/abstract/Controller';
import { Controller, Post } from '../../../../base/decorators/Controller';
import { UserRefreshTokenDTO } from './UserRefreshTokenDTO';
import { UserRefreshTokenService } from './UserRefreshTokenService';
@Controller()
@Post("/authenticate/refresh-token", true)
export class UserRefreshTokenController extends BaseController<UserRefreshTokenService> {

  constructor(props: InjectableController<UserRefreshTokenService>) {
    super(props)
  }

  async handle({ body, headers }: ControllerProps) {
    try {
      const access_token = headers.authorization?.split(" ")?.[1]
      const dto = new UserRefreshTokenDTO({ ...body, access_token })
      return await this.service.execute(dto);
    } catch (error) {
      return this.exceptionController.handle(error)
    }
  }
}



