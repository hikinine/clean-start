import { ValidationException } from '../errors/ValidationException';
export abstract class BaseRequired {

  static check<TypeDTO>(dto: Object, dep: (keyof TypeDTO)[] | string[]) {
    for (const requiredField of dep) {
      if (!dto.hasOwnProperty(requiredField)) {
        throw new ValidationException(`Campo obrigatório: ${String(requiredField)}.`)
      }
    }
  }
}