
import { EntityLayer } from './../../../base/interface/Entity';
import { Entity } from "../../../base/abstract/Entity";
import { AuthorizationException } from "../../../base/errors";
import bcrypt from "bcrypt"
import { RefreshToken } from './UserRefreshToken';
import { EntityProps, Relation, Unique, Many } from '../interface/entities.contract';

export class User extends Entity implements EntityLayer<UserProps> {
  static DEFAULT_EXPIRES_IN = "12h"
  
  readonly refreshToken?: RefreshToken

  id: string
  companyId: string 
  name: string
  email: string
  password: string
  phone: string
  privilege: number
  role: number
  status: boolean
  createdAt: Date
  updatedAt: Date

  constructor(props: UserProps) {
    super()
    this.id = Entity.createUUID(props.id);
    this.name = Entity.RequiredText(props.name, { length: [3, 70] });
    this.email = Entity.RequiredEmail(props.email, { length: [4, 100] })
    this.password = Entity.RequiredText(props.password, { length: [6, 100] })
    this.phone = Entity.RequiredText(props.phone, { length: [14, 15], mask: Entity.Mask.phone })
    this.status = Entity.OptionalBoolean(props.status, { defaultValue: true })
    this.privilege = Entity.OptionalNumber(props.privilege, { defaultValue: 0 })
    this.role = Entity.OptionalNumber(props.role, { defaultValue: 0 })
    this.createdAt = Entity.CreatedAt(props.createdAt)
    this.updatedAt = Entity.UpdatedAt();

    this.setRelationship(props, new RelationshipMapper(), this)
  }

  public ensureEncryptedPasswordMatchWith(password: string) {
    const match = bcrypt.compareSync(password, this.password)

    if (!match) {
      throw new AuthorizationException(`Usuário ou senha incorreta!`)
    }
  }

  public hasRefreshToken() {
    return Boolean(this?.refreshToken?.id)
  }

}


export interface UserProps extends EntityProps<
  Relation<Unique>["refreshToken"] 
> {
  name: string
  email: string
  password: string
  phone: string
  privilege?: number
  role?: number
  status?: boolean
}

class RelationshipMapper {
  refreshToken = RefreshToken
}

