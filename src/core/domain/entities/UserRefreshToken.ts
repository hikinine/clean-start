import { Entity } from "../../../base/abstract/Entity"
import { EntityProps, NonRelationship } from "../interface/entities.contract"
import { randomBytes } from 'crypto';
export class RefreshToken extends Entity implements RefreshTokenProps {
  id: string
  userId: string
  createdAt: Date
  updatedAt: Date

  constructor(props: RefreshTokenProps) {
    super()
    this.id = Entity.createUUID(props.id);
    this.userId = Entity.createRequiredId(props.userId)
    this.createdAt = Entity.CreatedAt(props.createdAt)
    this.updatedAt = Entity.UpdatedAt()
  }

  static generateRandom48bitsToken() {
    return randomBytes(48).toString("hex")
  }
}
export interface RefreshTokenProps extends EntityProps<NonRelationship> {
  userId: string
}