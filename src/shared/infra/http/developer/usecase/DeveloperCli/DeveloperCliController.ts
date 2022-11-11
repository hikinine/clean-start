import { Request, Response } from "express";
import { DeveloperCliService } from "./DeveloperCliService";

export class DeveloperCliController {

  constructor(private readonly service: DeveloperCliService) { }

  async handle(request: Request, response: Response) {
    try {
      const serviceResponse = await this.service.execute(request.body)
      return response.status(200).json(serviceResponse)
    } catch (error) {
      response.status(400).json(error)
    }
  }
}