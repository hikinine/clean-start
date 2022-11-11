import { exceptionController } from '../../../base/ApplicationExceptionController';
import { Module } from '../../../base/decorators/Module';
import { PrismaRefreshTokenRepository } from './../../repositories/implementation/PrismaRefreshTokenRepository';
import { PrismaUserRepository } from './../../repositories/implementation/PrismaUserRepository';

@Module({
  service: {
    repositories: [
      PrismaUserRepository,
      PrismaRefreshTokenRepository
    ],
    providers: [

    ]
  },
  controller: {
    exceptionHandler: exceptionController
  }

})
export class AuthenticateModule { }