import { IsDefined, IsObject, IsOptional } from "class-validator";
import { DTOValidation } from '../../../../base/abstract/DTOValidation';
import { QueryPagination } from "../../../../base/abstract/QueryPagination";
import { BaseAuthenticationPayload } from './../../../../base/abstract/Authentication';

export class UserOverviewDTO extends DTOValidation {
  @IsObject()
  @IsDefined()
  me: BaseAuthenticationPayload

  @IsOptional()
  query?: QueryPagination


  constructor(props: UserOverviewDTO) {
    super(props)
  }

}

