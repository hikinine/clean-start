import bcrypt from 'bcrypt';
import { Authorization } from '../../../base/abstract/Authorization';

import { Entity } from '../../../base/abstract/Entity';
import { AuthorizationException } from '../../../base/errors';
import { EntityLayer } from '../../../base/interface/Entity';
import { EntityProps, Relation, Unique } from '../interface/entities.contract';
import { RefreshToken } from './UserRefreshToken';
export class User extends Entity implements EntityLayer<UserProps> {
  readonly refresh_token?: RefreshToken

  id: string
  name: string
  email: string
  password: string
  privilege: number
  status: boolean
  createdAt: Date
  updatedAt: Date

  constructor(props: UserProps) {
    super()
    this.id = Entity.createUUID(props.id);
    this.name = Entity.RequiredText(props.name, { length: [3, 70] });
    this.email = Entity.RequiredEmail(props.email, { length: [4, 100] })
    this.password = Entity.RequiredText(props.password, { length: [6, 100] })
    this.privilege = Entity.OptionalNumber(props.privilege, { defaultValue: Authorization.Level.InsideSales })
    this.createdAt = Entity.CreatedAt(props.createdAt)
    this.updatedAt = Entity.UpdatedAt();
    this.setRelationship(props, new RelationshipMapper(), this)
  }
  public toPublicView() {
    const user: User = JSON.parse(JSON.stringify(this))
    delete user.password
    return user
  }

  public update(props: Partial<User>) {
    const user = new User({ ...this, ...props })
    Object.assign(this, user)
  }
  public encryptPassword() {
    this.password = bcrypt.hashSync(this.password, 8)
  }
  public ensureEncryptedPasswordMatchWith(password: string) {
    const match = bcrypt.compareSync(password, this.password)

    if (!match) {
      throw new AuthorizationException(`Usuário ou senha incorreta!`)
    }
  }

  public hasRefreshToken() {
    return Boolean(this?.refresh_token?.id)
  }

  public has(privilege: number) {
    return this.privilege >= privilege
  }

}


export interface UserProps extends EntityProps<
  Relation<Unique>["refresh_token"]
> {
  name: string
  email: string
  password: string
  privilege?: number

  whatsapp?: string
  instagram?: string
  facebook?: string
  linkedin?: string
  hero?: string
}
class RelationshipMapper {
  refresh_token: typeof RefreshToken

  constructor() {
    this.refresh_token = RefreshToken
  }
}