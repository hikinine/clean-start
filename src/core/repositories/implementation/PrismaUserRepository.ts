import { Prisma, PrismaClient, user } from '@prisma/client';
import { BaseRepository } from '../../../base/abstract/Repository';
import { Repository } from '../../../base/decorators/Repository';
import { QueryOptions } from '../../../base/interface/repository';
import { Many, WriteOptions } from '../../domain/interface/contract';
import { ValidationException } from './../../../base/errors/ValidationException';
import { User } from './../../domain/entities/User';
import { UserRepository } from './../UserRepository';

@Repository({
  contextPrisma: true,
  interface: "UserRepository"
})
export class PrismaUserRepository extends BaseRepository implements UserRepository {

  private static instance: PrismaUserRepository;
  private contextPrisma: PrismaClient
  private constructor(contextPrisma: PrismaClient) {
    super()
    this.contextPrisma = contextPrisma
  }

  public static getInstance(prisma: PrismaClient) {
    if (!PrismaUserRepository.instance) {
      PrismaUserRepository.instance = new PrismaUserRepository(prisma);
    }
    return PrismaUserRepository.instance;
  }

  decoder(data: User): user {
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      privilege: data.privilege,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      password: data.password,
    }
  }
  async transaction(callback: (tx: Prisma.TransactionClient) => Promise<any>): Promise<any> {
    return this.contextPrisma.$transaction(callback)
  }

  async create(data: User, options?: WriteOptions) {
    const dataDecoded = this.decoder(data)
    const context = options?.context ?? this.contextPrisma
    const Query = await context.user.create({
      data: dataDecoded
    })

    if (!Query?.id)
      throw new ValidationException("Falha ao registrar user.");
  }
  async update(data: User, options?: WriteOptions) {
    const dataDecoded = this.decoder(data)
    const context = options?.context ?? this.contextPrisma
    const query = await context.user.update({
      where: { id: data.id },
      data: dataDecoded
    });

    if (!query)
      throw new ValidationException("Falha ao atualizar o user")
  }
  async delete(userId: string, options?: WriteOptions) {
    const context = options?.context ?? this.contextPrisma
    const Query = await context.user.delete({
      where: { id: userId }
    })

    if (!Query)
      throw new ValidationException("Falha ao deletar user")
  }


  async findAll(options?: Partial<Prisma.userFindManyArgs>, query?: QueryOptions): Promise<Many<User>> {
    const where = { ...options?.where }

    const [payload, total] = await Promise.all([
      this.contextPrisma.user.findMany({
        where,
        ...options,

      }),
      this.contextPrisma.user.count({ where })
    ])

    if (query?.raw) {
      return { payload, total } as Many<User>
    }
    return {
      payload: payload.map(user => new User(user)),
      total
    };
  }

  async findUnique(options: Prisma.userFindUniqueArgs, query?: QueryOptions): Promise<User> {
    const data = await this.contextPrisma.user.findUnique(options)

    if (!data)
      throw new ValidationException("Não encontrei nenhum user com esse ID")

    if (query?.raw) {
      return data as User
    }

    return new User(data)
  }
}
