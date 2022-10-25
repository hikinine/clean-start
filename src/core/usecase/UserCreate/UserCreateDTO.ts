import { BaseAuthenticationPayload } from './../../../base/abstract/Authentication';
import { IsString, Length, IsObject, IsDefined, IsOptional, IsNumber } from "class-validator"
import { DTOValidation } from '../../../base/abstract/DTOValidation';

export class UserCreateDTO extends DTOValidation {
  @IsObject()
  @IsDefined()
  @IsOptional()
  me: BaseAuthenticationPayload

  @IsString()
  name: string

  @IsString()
  email: string

  @IsString()
  @Length(6, 100)
  password: string

  @IsString()
  phone: string

  constructor(props: UserCreateDTO) {
    super(props)
    Object.assign(this, props)
  }
}

