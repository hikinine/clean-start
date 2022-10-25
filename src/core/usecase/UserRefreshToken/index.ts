
import { exceptionController } from '../../../base/ApplicationExceptionController';
import { prismaInstance } from '../../../shared/infra/database/prisma/client';
import { UserRefreshTokenService } from './UserRefreshTokenService';
import { UserRefreshTokenController } from './UserRefreshTokenController';
import { PrismaUserRepository } from './../../repositories/implementation/PrismaUserRepository';
import { PrismaRefreshTokenRepository } from './../../repositories/implementation/PrismaRefreshTokenRepository';



export const userRefreshTokenService = new UserRefreshTokenService({
  repository: {
    user: PrismaUserRepository.getInstance(prismaInstance),
    refreshtoken: PrismaRefreshTokenRepository.getInstance(prismaInstance),
  },
  services: {}
});

export const userRefreshTokenController =
  new UserRefreshTokenController({
    service: userRefreshTokenService,
    exceptionController
  });