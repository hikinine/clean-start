import { ValidationException } from './../../../base/errors/ValidationException';
import { UserRepository } from './../UserRepository';
import { User } from './../../domain/entities/User';
import { Many } from '../../domain/interface/contract';
import { Prisma, PrismaClient } from '@prisma/client';

export class PrismaUserRepository implements UserRepository {
  private static instance: PrismaUserRepository;
  private contextPrisma: PrismaClient
  private constructor(contextPrisma: PrismaClient) {
    this.contextPrisma = contextPrisma
  }

  public static getInstance(prisma: PrismaClient) {
    if (!PrismaUserRepository.instance) {
      PrismaUserRepository.instance = new PrismaUserRepository(prisma);
    }
    return PrismaUserRepository.instance;
  }

  async create(data: User) {
    const Query = await this.contextPrisma.user.create({
      data: {
        id: data.id,
        email: data.email,
        name: data.name,
        phone: data.phone,
        status: data.status,
        privilege: data.privilege,
        role: data.role,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        password: data.password,
      }
    })

    if (!Query?.id)
      throw new ValidationException("Falha ao registrar user.");
  }
  async update(data: User) {
    const query = await this.contextPrisma.user.update({
      where: { id: data.id },
      data: {
        id: data.id,
        email: data.email,
        name: data.name,
        phone: data.phone,
        status: data.status,
        privilege: data.privilege,
        role: data.role,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        password: data.password,
      }
    });

    if (!query)
      throw new ValidationException("Falha ao atualizar o user")
  }
  async delete(userId: string) {
    const Query = await this.contextPrisma.user.delete({
      where: { id: userId }
    })

    if (!Query)
      throw new ValidationException("Falha ao deletar user")
  }


  async findAll(options?: Partial<Prisma.userFindManyArgs>): Promise<Many<User>> {
    const where = { ...options?.where }

    const [payload, total] = await Promise.all([
      this.contextPrisma.user.findMany({
        where,
        ...options,

      }),
      this.contextPrisma.user.count({ where })
    ])
    return {
      payload: payload.map(user => new User(user)),
      total
    };
  }

  async findUnique(options: Prisma.userFindUniqueArgs): Promise<User> {
    const Query = await this.contextPrisma.user.findUnique({
      ...options
    })

    if (!Query)
      throw new ValidationException("Não encontrei nenhum user com esse ID")

    return new User(Query)
  }



}
