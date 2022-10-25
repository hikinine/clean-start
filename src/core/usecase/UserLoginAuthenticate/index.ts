import { userCreateService } from './../UserCreate/index';
import { exceptionController } from './../../../base/ApplicationExceptionController';
import { PrismaUserRepository } from './../../repositories/implementation/PrismaUserRepository';
import { UserLoginAuthenticateService } from './UserLoginAuthenticateService';
import { UserLoginAuthenticateController } from './UserLoginAuthenticateController';
import { PrismaRefreshTokenRepository } from '../../repositories/implementation/PrismaRefreshTokenRepository';
import { JWTAuthenticateRepository } from '../../repositories/implementation/JWTAuthenticateRepository';
import { prismaInstance } from './../../../shared/infra/database/prisma/client';


export const userLoginAuthenticateService = new UserLoginAuthenticateService({
  services: {
    userCreate: userCreateService
  },
  repository: {
    user: PrismaUserRepository.getInstance(prismaInstance),
    refreshToken: PrismaRefreshTokenRepository.getInstance(prismaInstance),
    authenticate: JWTAuthenticateRepository.getInstance()
  }
});

export const userLoginAuthenticateController =
  new UserLoginAuthenticateController({
    service: userLoginAuthenticateService,
    exceptionController
  });
