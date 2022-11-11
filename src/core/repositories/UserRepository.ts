import { Prisma } from '@prisma/client';
import { QueryOptions } from '../../base/interface/repository';
import { Many, Transaction, WriteOptions } from "../domain/interface/contract";
import { User } from './../domain/entities/User';


export interface UserRepository {
  transaction<T extends unknown = any>(callback: Transaction<T>): Promise<T>

  create(toCreate: User, options?: WriteOptions): Promise<void>;
  update(toUpdate: User, options?: WriteOptions): Promise<void>;
  delete(userId: string, options?: WriteOptions): Promise<void>;

  findUnique(options: Prisma.userFindUniqueArgs, query?: QueryOptions): Promise<User>
  findAll(options?: Partial<Prisma.userFindManyArgs>, query?: QueryOptions): Promise<Many<User>>
}