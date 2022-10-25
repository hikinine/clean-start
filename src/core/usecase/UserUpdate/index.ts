
import { exceptionController } from '../../../base/ApplicationExceptionController';
import { prismaInstance } from '../../../shared/infra/database/prisma/client';
import { UserUpdateService } from './UserUpdateService';
import { UserUpdateController } from './UserUpdateController';
import { PrismaUserRepository } from './../../repositories/implementation/PrismaUserRepository';



export const userUpdateService = new UserUpdateService({
  repository: {
    user: PrismaUserRepository.getInstance(prismaInstance),
    },
  services: {}
});

export const userUpdateController =
  new UserUpdateController({
    service: userUpdateService,
    exceptionController
  });