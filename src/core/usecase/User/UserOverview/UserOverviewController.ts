import { BaseController, ControllerProps, InjectableController } from '../../../../base/abstract/Controller';
import { Controller, Get } from '../../../../base/decorators/Controller';
import { UserOverviewDTO } from './UserOverviewDTO';
import { UserOverviewService } from './UserOverviewService';


@Controller()
@Get("/user")
export class UserOverviewController extends BaseController<UserOverviewService> {

  constructor(props: InjectableController<UserOverviewService>) {
    super(props)
  }

  async handle({ body, query }: ControllerProps) {
    try {
      const dto = new UserOverviewDTO({ ...body, query })
      return await this.service.execute(dto);
    } catch (error) {
      return this.exceptionController.handle(error)
    }
  }
}



