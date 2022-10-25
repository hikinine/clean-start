import { BaseAuthentication } from './Authentication';
import { AuthorizationException } from '../errors/AuthorizationException';
import { ServiceAuthorizationD } from '../interface/Authorization';
import { Color, logger } from '../utils/colorLogger';


export namespace Authorization {
  export class Role {
    static User = 0
  }
  export class Level {
    static Admin = 4
    static Financeiro = 3
    static Gerente = 2
    static Basic = 1
    static Free = 0
  }

}