
import { MetadataKeys } from "../../shared/container/application.container.constants";
import { formatRepository } from "../utils/format-repository";


export type RepositoryMetadata = {
  id: string,
  interface: string
  shortId: string
  contextPrisma?: boolean
}

export function Repository(props: { contextPrisma?: boolean, interface: string }) {
  return (constructor: Function) => {

    Reflect.defineMetadata(
      MetadataKeys.Repository,
      {
        id: constructor.name,
        interface: props.interface,
        shortId: formatRepository(props.interface.replace("Repository", "")),
        contextPrisma: props?.contextPrisma
      },
      constructor
    );

  }
}