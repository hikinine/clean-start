import { BaseException } from "../abstract/Exception";

export class UnprocessableEntityException extends BaseException {
  public code = 422;
  public type = "Erro no processamento da entidade"
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