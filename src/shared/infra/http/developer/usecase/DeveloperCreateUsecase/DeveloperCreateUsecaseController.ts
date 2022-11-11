import { IsArray, IsString } from "class-validator";
import { Request, Response } from "express";
import { DTOValidation } from "../../../../../../base/abstract/DTOValidation";
import { DeveloperCreateUsecaseService } from "./DeveloperCreateUsecaseService";

export class DeveloperCreateUsecaseDTO extends DTOValidation {
  @IsString()
  usecase: string
  @IsArray()
  repositories: string[]
  @IsString()
  usecaseModule: string
  @IsString()
  method: string
  @IsString()
  path: string
  @IsArray()
  middleware: string[]
  constructor(props: DeveloperCreateUsecaseDTO) {
    super(props)
  }
}

export class DeveloperCreateUsecaseController {

  constructor(private readonly service: DeveloperCreateUsecaseService) { }

  async handle(request: Request, response: Response) {
    try {
      const dto = new DeveloperCreateUsecaseDTO(request.body)
      const serviceResponse = await this.service.execute(dto)
      return response.status(200).json(serviceResponse)
    } catch (error) {
      response.status(400).json(error)
    }
  }
}