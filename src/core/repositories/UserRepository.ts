import { Prisma } from '@prisma/client';
import { User } from './../domain/entities/User';
import { Many } from "../domain/interface/contract";

export interface UserRepository {

  create(toCreate: User): Promise<void>;
  update(toUpdate: User): Promise<void>;
  delete(userId: string): Promise<void>;

  findUnique(options: Prisma.userFindUniqueArgs): Promise<User>
  findAll(options?: Partial<Prisma.userFindManyArgs>): Promise<Many<User>>
}