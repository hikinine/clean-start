import { IsDefined, IsObject, IsString, Length } from "class-validator";
import { DTOValidation } from '../../../../base/abstract/DTOValidation';
import { BaseAuthenticationPayload } from './../../../../base/abstract/Authentication';

export class UserCreateDTO extends DTOValidation {
  @IsObject()
  @IsDefined()
  me: BaseAuthenticationPayload
  @IsString()
  name: string
  @IsDefined()
  @IsString()
  email: string
  @IsString()
  @Length(6, 100)
  password: string

  constructor(props: UserCreateDTO) {
    super(props)
  }

}

