import { BadRequest } from './errors/BadRequestException';
import { UnprocessableEntityException } from './errors/UnprocessableEntityException';

import { BaseException } from "./abstract/Exception";
import {
  AuthenticationException,
  AuthorizationException, InvalidQueryException, PrismaClientKnownRequestError, QueryNotFound, ValidationException
} from "./errors";

import { Catch } from "./interface/Exception";
import { Color, logger } from "./utils/colorLogger";

export class ApplicationExceptionController extends BaseException {
  constructor() {
    super();
  }

  protected AuthenticationException(C: Catch<AuthenticationException>) {

    return C.error
  }
  protected ValidationException(C: Catch<ValidationException>) {

    return C.error
  }

  protected InvalidQueryException(C: Catch<InvalidQueryException>) {
    return C.error
  }

  protected AuthorizationException(C: Catch<AuthorizationException>) {
    return C.error
  }
  protected QueryNotFound(C: Catch<QueryNotFound>) {
    return C.error
  }
  protected DefaultErrorInstance(C: Catch<Error>) {
    return C.error
  }

  protected PrismaClientKnownRequestError(C: Catch<PrismaClientKnownRequestError>) {
    return C.error
  }




  handle(error: unknown) {
    const { message } = error as any
    console.log(error)
    logger([
      {
        color: Color.red,
        message
      },
    ])

    if (error instanceof BadRequest) {
      return this.AuthenticationException({ error });
    }
    if (error instanceof UnprocessableEntityException) {
      return this.AuthenticationException({ error });
    }
    if (error instanceof AuthenticationException) {
      return this.AuthenticationException({ error });
    }
    if (error instanceof ValidationException) {
      return this.ValidationException({ error });
    }
    if (error instanceof QueryNotFound) {
      return this.QueryNotFound({ error });
    }

    if (error instanceof AuthorizationException) {
      return this.AuthorizationException({ error });
    }

    if (error instanceof InvalidQueryException) {
      return this.InvalidQueryException({ error });
    }

    if (error instanceof PrismaClientKnownRequestError) {
      return this.PrismaClientKnownRequestError({ error });
    }

    if (error instanceof Error) {
      return this.DefaultErrorInstance({ error });
    }

    return error
  }
}
export const exceptionController = new ApplicationExceptionController()