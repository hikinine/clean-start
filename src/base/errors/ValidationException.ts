import { BaseException } from "../abstract/Exception";

export class ValidationException extends BaseException {
  public code = 400;
  public type = "Erro de validação"
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