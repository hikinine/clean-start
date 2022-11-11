import { Bind, Controller as BindController } from "../../shared/infra/http/middleware/bind";
import { BaseController } from "../abstract/Controller";
import { BaseRepository } from "../abstract/Repository";
import { Service as IService } from "../abstract/Service";
export type Service = IService<unknown, unknown>;

export type Dependencies = {
  key: string,
  alias?: string[]
  instance: BaseController | Service | BaseRepository
};
export type Route = { method: "get" | "post" | "put" | "delete" | "patch", path: `/${string}`, controllerKey: string, controller: Bind<BindController>, middleware: Array<any>, waitingInstall: boolean }
export type Enumerable<T> = T | Array<T>;


export type Listeners = { eventName: string, id: string}
export type ApplicationContainerModules = BaseController<Service> | Service | BaseRepository

export type RegisterRoute = Pick<Route, "method" | "middleware" | "path"> & { controllerKey: string }