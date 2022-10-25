import { BaseException } from "../abstract/Exception";

export class AuthorizationException extends BaseException {
  public code = 403;
  public type = "Autorização insuficiente"
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