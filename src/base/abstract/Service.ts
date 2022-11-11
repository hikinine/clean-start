import { AuthorizationException } from '../errors/AuthorizationException';
import { BaseAuthenticationPayload } from "./Authentication";
import { DTOValidation } from "./DTOValidation";

export type InjectableDependencies<InjectedRepositories, InjectedServices> = {
  services: InjectedServices
  repository: InjectedRepositories
}

export class Service<InjectedRepositories, InjectedServices> {

  protected services: InjectedServices
  protected repository: InjectedRepositories

  private authorization: {
    level: number
  }

  protected ensureAuthorityPermission(dto: DTOValidation & { me: BaseAuthenticationPayload }) {
    if (this.authorization.level > 0 && dto.me.privilege < this.authorization.level) {
      throw new AuthorizationException("Você não tem permissão para acessar esse fluxo.")
    }
  }
  protected setAuthorization(props: { level: number }) {
    this.authorization = props
  }
  public injectionOverride(props: {
    repository: InjectedRepositories,
    services: InjectedServices
  }) {
    this.repository = props.repository
    this.services = props.services
  }
  constructor(props: InjectableDependencies<InjectedRepositories, InjectedServices>) {
    this.repository = props.repository;
    this.services = props.services
  }

  async execute(dto: DTOValidation): Promise<unknown> {
    return {}
  }
}
