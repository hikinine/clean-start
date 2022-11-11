import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../base/abstract/Repository';
import { Repository } from '../../../base/decorators/Repository';
import { QueryNotFound } from '../../../base/errors/QueryNotFound';
import { RefreshTokenRepository } from '../RefreshTokenRepository';
import { RefreshToken } from './../../domain/entities/UserRefreshToken';

@Repository({
  contextPrisma: true,
  interface: "RefreshTokenRepository"
})
export class PrismaRefreshTokenRepository extends BaseRepository implements RefreshTokenRepository {

  private static instance: PrismaRefreshTokenRepository;
  private contextPrisma: PrismaClient
  private constructor(contextPrisma: PrismaClient) {
    super()
    this.contextPrisma = contextPrisma
  }

  public static getInstance(contextPrisma: PrismaClient) {
    if (!PrismaRefreshTokenRepository.instance) {
      PrismaRefreshTokenRepository.instance = new PrismaRefreshTokenRepository(contextPrisma);
    }
    return PrismaRefreshTokenRepository.instance;
  }

  async create(data: RefreshToken) {
    try {
      const Query = await this.contextPrisma.refresh_token.upsert({
        where: { user_id: data.user_id },
        create: {
          createdAt: data.createdAt,
          id: data.id,
          updatedAt: data.updatedAt,
          user_id: data.user_id
        },
        update: {
          createdAt: data.createdAt,
          id: data.id,
          updatedAt: data.updatedAt,
          user_id: data.user_id
        }
      })
  
      if (!Query) {
        throw new QueryNotFound(`Não consegui gerar um novo refresh token.`)
      }
  
      return new RefreshToken(Query)
    } catch (error) {
      throw new QueryNotFound(`Não consegui gerar um novo refresh token.`)
    }
   
  }

  async check(data: RefreshToken) {
    const Query = await this.contextPrisma.refresh_token.findMany({
      where: {
        id: data.id,
        user_id: data.user_id
      }
    })

    if (!Query.length) {
      throw new QueryNotFound(`Não consigo validar o seu token.`)
    }

    return new RefreshToken(Query[0])
  }
  async revokeFrom(user_id: string) {
    try {
      const Query = await this.contextPrisma.refresh_token.delete({
        where: { user_id }
      })
    } catch (error) {
      
    }

  }
}
