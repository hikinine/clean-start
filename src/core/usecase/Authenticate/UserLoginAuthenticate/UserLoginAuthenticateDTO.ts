import { IsString, Length } from "class-validator";
import { DTOValidation } from '../../../../base/abstract/DTOValidation';


export class UserLoginAuthenticateDTO extends DTOValidation {
  @IsString()
  @Length(4, 100)
  email: string;

  @IsString()
  @Length(6, 100)
  password: string

  constructor(props: UserLoginAuthenticateDTO) {
    super(props)
  }

}

