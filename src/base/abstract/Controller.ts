import { ApplicationExceptionController } from '../ApplicationExceptionController';
import { AuthorizationException } from '../errors/AuthorizationException';
import { BaseAuthenticationPayload } from "./Authentication";
import { DTOValidation } from "./DTOValidation";
import { Service } from './Service';



export interface ControllerProps {
  body?: any
  params?: { [key: string]: string },
  query?: any
  headers?: any
  file?: any
}

export type InjectableController<IService extends Service<unknown, unknown> = Service<unknown, unknown>> = {
  service: IService
  exceptionController: ApplicationExceptionController;
}


export abstract class BaseController<IService extends Service<unknown, unknown> = Service<unknown, unknown>> {
  public statusCode: number

  protected service: IService
  protected exceptionController: ApplicationExceptionController;

  public authorization: {
    level: number
  }

  public ensureAuthorityPermission(dto: DTOValidation & { me: BaseAuthenticationPayload }) {
    if (this.authorization.level > 0 && dto.me.privilege < this.authorization.level) {
      throw new AuthorizationException("Você não tem permissão para acessar esse fluxo. Level necessário: " + this.authorization.level + ".")
    }
  }

  constructor(props: InjectableController<IService>) {
    this.service = props.service;
    this.exceptionController = props.exceptionController;
  }
}
