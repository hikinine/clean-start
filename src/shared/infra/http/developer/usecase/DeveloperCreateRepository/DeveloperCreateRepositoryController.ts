import { IsString } from "class-validator";
import { Request, Response } from "express";
import { DTOValidation } from "../../../../../../base/abstract/DTOValidation";
import { DeveloperCreateRepositoryService } from "./DeveloperCreateRepositoryService";

export class DeveloperCreateRepositoryDTO extends DTOValidation {
  @IsString()
  name: string

  @IsString()
  implementation: string
  constructor(props: DeveloperCreateRepositoryDTO) {
    super(props)
  }
}

export class DeveloperCreateRepositoryController {

  constructor(private readonly service: DeveloperCreateRepositoryService) { }

  async handle(request: Request, response: Response) {
    try {
      const dto = new DeveloperCreateRepositoryDTO(request.body)
      const serviceResponse = await this.service.execute(dto)
      return response.status(200).json(serviceResponse)
    } catch (error) {
      response.status(400).json(error)
    }
  }
}