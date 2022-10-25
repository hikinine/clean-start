import { UserLoginAuthenticateDTO } from './UserLoginAuthenticateDTO';
import { Request, Response } from 'express';
import { UserLoginAuthenticateService } from './UserLoginAuthenticateService';
import { ApplicationExceptionController } from './../../../base/ApplicationExceptionController';

export class UserLoginAuthenticateController {

  private service: UserLoginAuthenticateService;
  private exceptionController: ApplicationExceptionController;

  constructor(props: {
    service: UserLoginAuthenticateService;
    exceptionController: ApplicationExceptionController
  }) {
    this.service = props.service;
    this.exceptionController = props.exceptionController;
  }

  async handle(request: Request, response: Response) {
    try {
      const dto = new UserLoginAuthenticateDTO(request.body)
      const User = await this.service.execute(dto);
      return response.status(200).json(User); 
    } catch (error) {
      return this.exceptionController.handle(response, error)
    }
  }
}
