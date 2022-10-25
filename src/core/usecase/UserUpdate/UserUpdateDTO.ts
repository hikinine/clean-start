import { BaseAuthenticationPayload } from './../../../base/abstract/Authentication';
import { IsOptional, Length, IsObject, IsDefined } from "class-validator"
import { DTOValidation } from '../../../base/abstract/DTOValidation';

export class UserUpdateDTO extends DTOValidation {
  @IsObject()
  @IsDefined()
  @IsOptional()
  me: BaseAuthenticationPayload

  constructor(props: UserUpdateDTO) {
    super(props)
  }

}

