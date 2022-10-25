import { RefreshToken } from './../../domain/entities/UserRefreshToken';
import { RefreshTokenRepository } from '../RefreshTokenRepository';
import { QueryNotFound } from '../../../base/errors/QueryNotFound';
import { PrismaClient } from '@prisma/client';
export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  private static instance: PrismaRefreshTokenRepository;
  private contextPrisma: PrismaClient
  private constructor(contextPrisma: PrismaClient) {
    this.contextPrisma = contextPrisma
  }

  public static getInstance(contextPrisma: PrismaClient) {
    if (!PrismaRefreshTokenRepository.instance) {
      PrismaRefreshTokenRepository.instance = new PrismaRefreshTokenRepository(contextPrisma);
    }
    return PrismaRefreshTokenRepository.instance;
  }

  async createRefreshToken(data: RefreshToken) {
    const Query = await this.contextPrisma.refreshToken.upsert({
      where: { userId: data.userId },
      create: data,
      update: data
    })

    if (!Query) {
      throw new QueryNotFound(`Não consegui gerar um novo refresh token.`)
    }

    return new RefreshToken(Query)
  }

  async checkRefreshToken(data: RefreshToken) {
    const Query = await this.contextPrisma.refreshToken.findMany({
      where: {
        id: data.id,
        userId: data.userId
      }
    })

    if (!Query.length) {
      throw new QueryNotFound(`Não consigo validar o seu token.`)
    }

    return new RefreshToken(Query[0])
  }
  async revokeRefreshTokenFrom(userId: string) {

    const Query = await this.contextPrisma.refreshToken.delete({
      where: { userId  }
    })

    if (!Query) {
      throw new QueryNotFound(`Falha ao revogar token`)
    }

  }
}
