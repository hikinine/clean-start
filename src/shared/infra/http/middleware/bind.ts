import { NextFunction, Request, Response } from "express"


export type Controller = { handle: Function }
export type Bind<T extends Controller> = (request: Request, response: Response, next: NextFunction) => void

export function bind(controller: Controller): (request: Request, response: Response, next: NextFunction) => void {
  return controller.handle.bind(controller)
}

export type BindRoutes = {
  method: "post" | "put" | "get" | "delete" | "patch",
  path: `/${string}`
  controller: Bind<Controller>
  middleware: any[]
}
