import { AuthorizationException } from './../../../base/errors/AuthorizationException';
import { BadRequest } from './../../../base/errors/BadRequestException';

export namespace UserException {

  export class AlreadyExists extends BadRequest {
    constructor(message: string = "Usuario já cadastrado") {
      super(message)
    }
  }

  export class UnauthorizedToUpdateRoles extends AuthorizationException {
    constructor(message: string = `Você não tem permissão para alterar este cargo!`) {
      super(message)
    }
  }


}