import { BaseAuthentication } from './Authentication';
import { AuthorizationException } from '../errors/AuthorizationException';
import { ServiceAuthorizationD } from '../interface/Authorization';
import { Color, logger } from '../utils/colorLogger';


export class Authorization {
  static Role = {
    User: 0
  }
  static Level = {
    Admin: 4,
    Financeiro: 3,
    Gerente: 2,
    Basic: 1,
    Free: 0,
  }

}