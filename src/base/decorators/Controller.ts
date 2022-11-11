import { PrismaClientInitializationError } from "@prisma/client/runtime"
import { Request, Response } from "express"
import { MetadataKeys } from "../../shared/container/application.container.constants"
import { ensureAuthenticated } from "../../shared/infra/http/middleware"
import { BaseException } from "../abstract/Exception"
import { PrismaClientKnownRequestError } from "../errors"


type Pathname = `/${string}`;
export type ControllerMetadata = {
  id: string
}
export type HttpInterceptorMetadata = {
  method: "post" | "put" | "get" | "delete" | "patch"
  path: Pathname,
  controllerKey: string,
  middleware: Array<unknown>
}

export function Controller(role?: number) {

  function handleResponse(response: Response, result: any) {
    if (result instanceof BaseException) {
      response.status(result?.code || 500).json(result)
    }
    else if (result instanceof PrismaClientKnownRequestError) {
      response.status(400).json({ message: result.message })
    }
    else if (result instanceof PrismaClientInitializationError) {
      response.status(500).json({ message: "Falha na conexão com o banco de dados! Por favor tente novamente em alguns instantes!" })
    }
    else if (result instanceof Error) {
      response.status(500).json(result.message)
    }
    else {
      response.status(this?.statusCode || 200).json(result)
    }
  }

  return (constructor: Function) => {
    Reflect.defineMetadata(
      MetadataKeys.Controller,
      {
        id: constructor.name,
      },
      constructor
    )

    const originalMethod = constructor.prototype.handle
    constructor.prototype.authorization = { level: role || 0 }
    constructor.prototype.handle = async function (request: Request, response: Response) {

      try {
        this.ensureAuthorityPermission({ me: request.body.me })

        const result = await originalMethod.apply(this, [request, response]);
        return handleResponse.call(this, response, result)
      } catch (error) {
        return handleResponse.call(this, response, error)
      }
    };
  }
}

function HttpInterceptors(
  path: Pathname,
  method: "get" | "post" | "put" | "patch" | "delete",
  noAuthenticate: boolean = false,
  middleware: Array<any> = []
) {
  return (constructor: Function) => {

    constructor.prototype.statusCode = method === "post" ? 201 :
      method === "put" ? 201 :
        method === "delete" ? 201 :
          method === "patch" ? 201 : 200;

    const props = {
      method,
      path,
      controllerKey: constructor.name,
      middleware: noAuthenticate ? [] : [ensureAuthenticated, ...middleware]
    }

    Reflect.defineMetadata(MetadataKeys.HttpRoute, props, constructor)
  }
};
export function Get(path: Pathname, noAuthenticate?: boolean, middleware?: Array<any>) {
  return HttpInterceptors(path, "get", noAuthenticate, middleware)
}
export function Post(path: Pathname, noAuthenticate?: boolean, middleware?: Array<any>) {
  return HttpInterceptors(path, "post", noAuthenticate, middleware)
}
export function Patch(path: Pathname, noAuthenticate?: boolean, middleware?: Array<any>) {
  return HttpInterceptors(path, "patch", noAuthenticate, middleware)
}
export function Put(path: Pathname, noAuthenticate?: boolean, middleware?: Array<any>) {
  return HttpInterceptors(path, "put", noAuthenticate, middleware)
}
export function Delete(path: Pathname, noAuthenticate?: boolean, middleware?: Array<any>) {
  return HttpInterceptors(path, "delete", noAuthenticate, middleware)
}

