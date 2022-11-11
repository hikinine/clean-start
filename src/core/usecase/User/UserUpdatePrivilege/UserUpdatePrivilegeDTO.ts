import { IsDefined, IsNumber, IsObject, IsString } from "class-validator";
import { DTOValidation } from '../../../../base/abstract/DTOValidation';
import { BaseAuthenticationPayload } from './../../../../base/abstract/Authentication';

export class UserUpdatePrivilegeDTO extends DTOValidation {
  @IsObject()
  @IsDefined()
  me: BaseAuthenticationPayload

  @IsString()
  user_id: string
  @IsNumber()
  privilege: number

  constructor(props: UserUpdatePrivilegeDTO) {
    super(props)
  }

}

