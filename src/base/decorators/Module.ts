import { MetadataKeys } from "../../shared/container/application.container.constants";
import { BaseRepository } from '../abstract/Repository';

export type ModuleMetadata = {
  controller: { exceptionHandler: unknown },
  service: {
    providers: Array<any>,
    repositories: BaseRepository[]
  }
}
export function Module(props: ModuleMetadata) {
  return (target: Object) => {
    Reflect.defineMetadata(MetadataKeys.Modules, props, target)
  }
}

export interface ApplicationModule { }