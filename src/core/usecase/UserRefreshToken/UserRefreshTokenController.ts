import { Request, Response } from 'express';
import { UserRefreshTokenService } from './UserRefreshTokenService';
import { ApplicationExceptionController } from '../../../base/ApplicationExceptionController';
import { UserRefreshTokenDTO } from './UserRefreshTokenDTO';

export class UserRefreshTokenController {

  private service: UserRefreshTokenService;
  private exceptionController: ApplicationExceptionController;

  constructor(props: {
    service: UserRefreshTokenService;
    exceptionController: ApplicationExceptionController
  }) {
    this.service = props.service;
    this.exceptionController = props.exceptionController;
  }

  async handle(request: Request, response: Response) {
    try {
      const { } = request.params
      const query = request.query
      const accessToken = request.headers.authorization?.split(" ")?.[1]

      const dto = new UserRefreshTokenDTO({ ...request.body, accessToken })
      const ServiceResponse = await this.service.execute(dto);
      return response.status(200).json(ServiceResponse);
      
    } catch (error) {
      return this.exceptionController.handle(response, error)
    }
  }
}
