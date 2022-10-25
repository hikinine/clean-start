import { validateSync } from "class-validator"
import { BadRequest } from "../errors"

export abstract class DTOValidation {
  constructor(props: object) {
    const error = validateSync(props)

    if (error.length) {
      throw new BadRequest("Falha na validação dos campos " + error?.map(field => field?.property)?.join(", "), error)
    }
  }
}