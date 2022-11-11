import { validateSync } from "class-validator"
import { BadRequest } from "../errors"

export abstract class DTOValidation {
  constructor(props: object) {
    Object.assign(this, props)
    const error = validateSync(this, {
      forbidUnknownValues: true,
      whitelist: true,
      forbidNonWhitelisted: true,

    })

    if (error.length) {
      throw new BadRequest("Falha na validação dos campos " + error?.map(field => field?.property)?.join(", "), error)
    }
  }
}