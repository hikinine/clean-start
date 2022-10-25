import { BaseException } from "../abstract/Exception";

export class AuthenticationException extends BaseException {
  public code = 401;
  public type = "Erro de autenticação"
  public message: string;
  public extra: any

  constructor(message: string, extra?: any, type?: string, code?: number) {
    super()
    this.message = message
    this.type = type || this.type
    this.code = code || this.code
    this.extra = extra || undefined
  }
}