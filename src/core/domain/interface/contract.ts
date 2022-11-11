import { Prisma } from "@prisma/client"

export interface Many<Entity> {
  total: number,
  payload: Entity[]
}

export type Transaction<T> = (context: Prisma.TransactionClient) => Promise<T>
export type WriteOptions = { context?: Prisma.TransactionClient }