import { MetadataKeys } from "../../shared/container/application.container.constants"

export type ProviderMetadata = {
  id: string
  moduleGenerator: unknown
}
export function Provider(moduleGenerator: unknown) {
  return (constructor: Function) => {

    Reflect.defineMetadata(
      MetadataKeys.Provider,
      {
        id: constructor.name,
        moduleGenerator
      },
      constructor
    );

  }
}