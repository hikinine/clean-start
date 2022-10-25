import { RefreshToken } from './../domain/entities/UserRefreshToken';
export interface RefreshTokenRepository {
  createRefreshToken(data: RefreshToken): Promise<RefreshToken>
  checkRefreshToken(data: RefreshToken): Promise<RefreshToken>
  revokeRefreshTokenFrom(userId: string): Promise<void>
}
