import { IsDefined, IsObject, IsString } from "class-validator";
import { DTOValidation } from '../../../../base/abstract/DTOValidation';
import { BaseAuthenticationPayload } from './../../../../base/abstract/Authentication';

export class UserViewByIdDTO extends DTOValidation {
  @IsObject()
  @IsDefined()
  me: BaseAuthenticationPayload

  @IsString()
  user_id: string


  constructor(props: UserViewByIdDTO) {
    super(props)
  }

}

