import { RefreshToken } from './../domain/entities/UserRefreshToken';
export interface RefreshTokenRepository {
  create(data: RefreshToken): Promise<RefreshToken>
  check(data: RefreshToken): Promise<RefreshToken>
  revokeFrom(userId: string): Promise<void>
}
