export type InjectableDependencies<InjectedRepositories, InjectedServices> = {
  services: InjectedServices
  repository: InjectedRepositories
}

export class Service<InjectedRepositories, InjectedServices> {

  protected services: InjectedServices
  protected repository: InjectedRepositories

  private authorization: {
    role: number,
    level: number
  }

  protected setAuthorization(props: { role: number, level: number }) {
    this.authorization = props
  }
  public injectionOverride(props: {
    repository: InjectedRepositories,
    service: InjectedServices
  }) {
    this.repository = props.repository
    this.services = props.service
  }
  constructor(props: InjectableDependencies<InjectedRepositories, InjectedServices>) {
    this.repository = props.repository;
    this.services = props.services
  }

}
