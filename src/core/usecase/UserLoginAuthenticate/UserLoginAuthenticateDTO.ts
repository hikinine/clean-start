import { BaseAuthenticationPayload } from './../../../base/abstract/Authentication';
import { IsString, Length, IsObject, IsDefined, validate, validateSync, IsOptional } from "class-validator"
import { BadRequest } from '../../../base/errors';
import { DTOValidation } from '../../../base/abstract/DTOValidation';


export class UserLoginAuthenticateDTO extends DTOValidation {
  @IsObject()
  @IsDefined()
  @IsOptional()
  me: BaseAuthenticationPayload
  
  @IsString()
  @Length(4, 100)
  email: string;

  @IsString()
  @Length(6, 100)
  password: string

  constructor(props: UserLoginAuthenticateDTO) {
    super(props)
    Object.assign(this, props)
  }

}

