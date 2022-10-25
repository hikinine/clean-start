import { Request, Response } from 'express';
import { UserUpdateService } from './UserUpdateService';
import { ApplicationExceptionController } from '../../../base/ApplicationExceptionController';
import { UserUpdateDTO } from './UserUpdateDTO';

export class UserUpdateController {

  private service: UserUpdateService;
  private exceptionController: ApplicationExceptionController;

  constructor(props: {
    service: UserUpdateService;
    exceptionController: ApplicationExceptionController
  }) {
    this.service = props.service;
    this.exceptionController = props.exceptionController;
  }

  async handle(request: Request, response: Response) {
    try {   
      const { } = request.params
      const query = request.query
      
      const dto = new  UserUpdateDTO({...request.body, })
      const ServiceResponse = await this.service.execute(dto);
      return response.status(200).json(ServiceResponse);
      
    } catch (error) {
      return this.exceptionController.handle(response, error)
    }
  }
}
