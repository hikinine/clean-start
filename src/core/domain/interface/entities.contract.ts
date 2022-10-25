
import { User } from "../entities/User"
import { RefreshToken } from "../entities/UserRefreshToken"


export type Relationship<RelationType> = {
  refreshToken?: RelationMapper<"refreshToken", RelationType, RefreshToken>,
  user?: RelationMapper<"user", RelationType, User>,
}
export type NonRelationship = unknown

export type Optional<T> = Partial<T>

export type EntityProps<T> = T & {
  id?: string
  createdAt?: Date
  updatedAt?: Date
}

export type Relation<T> = Partial<Relationship<T>>
export type Many = number
export type Unique = string


export type RelationMapper<Field extends string, RelationType, Entity> = {
  [relationName in Field]?: RelationType extends Many ? Array<Entity> : Entity
}