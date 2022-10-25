import { UserCreateDTO } from './UserCreateDTO';
import { Request, Response } from 'express';
import { UserCreateService } from './UserCreateService';
import { ApplicationExceptionController } from '../../../base/ApplicationExceptionController';


export class UserCreateController {

  private service: UserCreateService;
  private exceptionController: ApplicationExceptionController;

  constructor(props: {
    service: UserCreateService;
    exceptionController: ApplicationExceptionController
  }) {
    this.service = props.service;
    this.exceptionController = props.exceptionController;
  }

  async handle(request: Request, response: Response) {
    try {
      const dto = new UserCreateDTO(request.body)
      const ServiceResponse = await this.service.execute(dto);
      return response.status(200).json(ServiceResponse);
    } catch (error) {
      return this.exceptionController.handle(response, error)
    }
  }
}
