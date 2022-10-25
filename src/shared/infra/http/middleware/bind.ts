import { Request, Response, NextFunction } from "express"

type Controller = { handle: Function }

export function bind(controller: Controller): (request: Request, response: Response, next: NextFunction) => void {
  return controller.handle.bind(controller)
}