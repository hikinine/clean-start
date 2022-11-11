import { IsDefined, IsObject, IsString, Length } from "class-validator";
import { DTOValidation } from '../../../../base/abstract/DTOValidation';
import { BaseAuthenticationPayload } from './../../../../base/abstract/Authentication';

export class UserUpdatePasswordDTO extends DTOValidation {
  @IsObject()
  @IsDefined()
  me: BaseAuthenticationPayload



  @IsString()
  old_password: string
  @IsString()
  @Length(6, 100)
  password: string
  constructor(props: UserUpdatePasswordDTO) {
    super(props)
  }

}

