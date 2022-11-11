import { DTOValidation } from "../../../base/abstract/DTOValidation";
import { Service } from "../../../base/abstract/Service";

export namespace JobsEvents {
  export class RunService {
    name: "run-service"
    payload: {
      service: typeof Service<unknown, unknown>,
      dto: DTOValidation,
    }
  }
}

export type Jobs =
  | JobsEvents.RunService

export type withArguments<T, P> = [name: T, payload: P]
export type withoutArguments<T> = [name: T]
