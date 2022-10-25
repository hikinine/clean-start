import { BaseException } from "../abstract/Exception";

export class QueryNotFound extends BaseException {
  public code = 400;
  public type = "Query não encontrada"
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