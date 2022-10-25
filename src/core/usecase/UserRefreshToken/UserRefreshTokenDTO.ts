import { BaseAuthenticationPayload } from './../../../base/abstract/Authentication';
import { IsOptional, Length, IsObject, IsDefined, IsString } from "class-validator"
import { DTOValidation } from '../../../base/abstract/DTOValidation';

export class UserRefreshTokenDTO extends DTOValidation {
  @IsString()
  refreshToken: string
  @IsString()
  accessToken: string

  constructor(props: UserRefreshTokenDTO) {
    super(props)
  }

}

