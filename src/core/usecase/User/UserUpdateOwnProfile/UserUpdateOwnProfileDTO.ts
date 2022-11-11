import { IsDefined, IsObject, IsOptional, IsString } from "class-validator";
import { DTOValidation } from '../../../../base/abstract/DTOValidation';
import { BaseAuthenticationPayload } from './../../../../base/abstract/Authentication';

export class UserUpdateOwnProfileDTO extends DTOValidation {
  @IsObject()
  @IsDefined()
  me: BaseAuthenticationPayload

  @IsString()
  @IsOptional()
  name?: string

  constructor(props: UserUpdateOwnProfileDTO) {
    super(props)
  }

}

