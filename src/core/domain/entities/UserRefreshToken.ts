import { randomBytes } from 'crypto';

import { Entity } from '../../../base/abstract/Entity';
import { EntityProps, NonRelationship } from '../interface/entities.contract';

export class RefreshToken extends Entity implements RefreshTokenProps {
  id: string
  user_id: string
  createdAt: Date
  updatedAt: Date

  constructor(props: RefreshTokenProps) {
    super()
    this.id = props.id || Entity.createUUID()
    this.user_id = Entity.createRequiredId(props.user_id)
    this.createdAt = Entity.CreatedAt(props.createdAt)
    this.updatedAt = Entity.UpdatedAt()
  }

  static generateRandom48bitsToken() {
    return randomBytes(48).toString("hex")
  }
}
export interface RefreshTokenProps extends EntityProps<NonRelationship> {
  user_id: string
}