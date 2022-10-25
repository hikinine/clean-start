
import { exceptionController } from '../../../base/ApplicationExceptionController';
import { prismaInstance } from '../../../shared/infra/database/prisma/client';
import { UserCreateService } from './UserCreateService';
import { UserCreateController } from './UserCreateController';
import { PrismaUserRepository } from './../../repositories/implementation/PrismaUserRepository';

export const userCreateService = new UserCreateService({
  repository: {
    user: PrismaUserRepository.getInstance(prismaInstance),
  },
  services: {}
});

export const userCreateController =
  new UserCreateController({
    service: userCreateService,
    exceptionController
  });