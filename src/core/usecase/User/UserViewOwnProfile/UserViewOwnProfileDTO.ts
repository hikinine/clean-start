import { BaseAuthenticationPayload } from './../../../../base/abstract/Authentication';
import { IsOptional, IsString, Length, IsObject, IsDefined } from "class-validator"
import { DTOValidation } from '../../../../base/abstract/DTOValidation';

export class UserViewOwnProfileDTO extends DTOValidation {
  @IsObject()
  @IsDefined()
  me: BaseAuthenticationPayload

  

  constructor(props: UserViewOwnProfileDTO) {
    super(props)
  }

}

