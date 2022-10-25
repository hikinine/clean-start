import { UnprocessableEntityException } from './errors/UnprocessableEntityException';
import { BadRequest } from './errors/BadRequestException';

import { Response } from "express";
import { BaseException } from "./abstract/Exception";
import {
  AuthenticationException,
  AuthorizationException,
  PrismaClientKnownRequestError,
  ValidationException,
  QueryNotFound,
  InvalidQueryException,
} from "./errors";

import { Catch } from "./interface/Exception";
import { logger, Color } from "./utils/colorLogger";

export class ApplicationExceptionController extends BaseException {
  constructor() {
    super();  
  }

  protected AuthenticationException(C: Catch<AuthenticationException>) {
  
    const { response, error } = C;
    return response.status(error.code).json(error);
  }
  protected ValidationException(C: Catch<ValidationException>) {
  
    const { response, error } = C;
    return response.status(error.code).json(error);
  }

  protected InvalidQueryException(C: Catch<InvalidQueryException>) {
    const { response, error } = C;
    
    return response.status(error.code).json(error);
  }

  protected AuthorizationException(C: Catch<AuthorizationException>) {
    const { response, error } = C;
    return response.status(error.code).json(error);
  }
  protected QueryNotFound(C: Catch<QueryNotFound>) {
    const { response, error } = C;
    return response.status(error.code).json(error);
  }
  protected DefaultErrorInstance(C: Catch<Error>) {
    const { response, error } = C;
    return response.status(500).json({
      type: "Error Default Instance",
      code: 500,
      message: error?.message,
      info: error?.name
    });
  }

  protected PrismaClientKnownRequestError(C: Catch<PrismaClientKnownRequestError>) {
    const { response, error } = C;

    if (error.code === "P2002") {
      return response.status(400).json({
        type: "database",
        code: 400,
        message: `Falha na criação. Já existe um registro com o mesmo valor.`,
        info: `${JSON.stringify(error?.meta)?.replace(/"/gi, " ")}`
      });
    }
    return response
      .status(422)
      .json({
        code: 422,
        type: "database",
        message: `${error.code} - Erro no processamento da entidade. ${JSON.stringify(error?.meta)?.replace(/"/gi, " ")}`,
      })    
  }


  

  handle(response: Response, error: unknown) {
    const { message } = error as any

    logger([
      {
        color: Color.red,
        message
      },
    ])

    if (error instanceof BadRequest) {
      return this.AuthenticationException({ response, error });
    }
    if (error instanceof UnprocessableEntityException) {
      return this.AuthenticationException({ response, error });
    }
    if (error instanceof AuthenticationException) {
      return this.AuthenticationException({ response, error });
    }
    if (error instanceof ValidationException) {
      return this.ValidationException({ response, error });
    }
    if (error instanceof QueryNotFound) {
      return this.QueryNotFound({ response, error });
    }

    if (error instanceof AuthorizationException) {
      return this.AuthorizationException({ response, error });
    }

    if (error instanceof InvalidQueryException) {
      return this.InvalidQueryException({ response, error });
    }

    if (error instanceof PrismaClientKnownRequestError) {
      return this.PrismaClientKnownRequestError({ response, error });
    }

    if (error instanceof Error) {
      return this.DefaultErrorInstance({ response, error });
    }

    return response.status(503).json(error);
  }
}
export const exceptionController = new ApplicationExceptionController()