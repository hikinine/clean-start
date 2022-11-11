import { IsString } from "class-validator";
import { DTOValidation } from '../../../../base/abstract/DTOValidation';

export class UserRefreshTokenDTO extends DTOValidation {
  @IsString()
  refresh_token: string
  @IsString()
  access_token: string


  constructor(props: UserRefreshTokenDTO) {
    super(props)
  }

}

