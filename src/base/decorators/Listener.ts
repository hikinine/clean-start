import { MetadataKeys } from "../../shared/container/application.container.constants"


export type ListenerMetadata = {
  id: string
  eventName: string
}
export function Listener(eventName: string) {
  return (constructor: Function) => {
    Reflect.defineMetadata(
      MetadataKeys.Events,
      {
        id: constructor.name,
        eventName
      },
      constructor
    )
  }
}
