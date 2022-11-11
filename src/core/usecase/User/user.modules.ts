import { PrismaRefreshTokenRepository } from './../../repositories/implementation/PrismaRefreshTokenRepository';
import { PrismaUserRepository } from './../../repositories/implementation/PrismaUserRepository';

import { exceptionController } from '../../../base/ApplicationExceptionController';
import { Module } from '../../../base/decorators/Module';

@Module({
  service: {
    providers: [
    ],
    repositories: [
      PrismaRefreshTokenRepository,
      PrismaUserRepository
    ]
  },
  controller: { exceptionHandler: exceptionController }

})
export class UserModule { }