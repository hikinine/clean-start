
import { ValidationException } from '../errors/ValidationException';

type OrderByProps = "asc" | "desc"
type OrderByNested = any | {
  [key: string]: OrderByProps
} | {
  [key: string]: OrderByProps
}[]
export abstract class QueryPagination {
  take?: number;
  skip?: number;

  orderBy?: string
  direction?: OrderByProps

  filter?: string
  q?: string
  in?: string

  [key: string]: any

}

export class Query {
  take?: number;
  skip?: number;
  orderBy?: OrderByNested

  constructor(
    props?: {
      take?: number;
      skip?: number;
      orderBy?: string
      direction?: OrderByProps,
      defaultOrderBy?: OrderByNested
    }
  ) {
    const allowedKeys = ["take", `filter`, "skip", "orderBy", `defaultWhere`, `defaultOrderBy`, "direction"]

    Object.keys(props || {}).forEach(key => {
      if (!allowedKeys.includes(key)) {
        throw new ValidationException(`Query não permitida. Key ${key} não permitida`)
      }
    })
    this.take = parseInt(props?.take as any) || 10

    if (this.take > 100)
      this.take = 100;

    this.skip = parseInt(props?.skip as any) || undefined

    this.orderBy = undefined
    if (props?.orderBy) {
      this.orderBy = {}
      this.orderBy[props?.orderBy] = props?.direction || "desc"
    }

    if (!this.orderBy) {
      this.orderBy = props?.defaultOrderBy || undefined
    }
  }
}
export class QueryWithFilter<Entity> extends Query {
  where: {
    OR: {
      [key: string]: {
        [key: string]: string
      }
    }
  }

  createNestedObject(base: Object, names: string[], value: any) {
    var lastName = arguments.length === 3 ? names.pop() : false;

    for (var i = 0; i < names.length; i++) {
      base = base[names[i]] = base[names[i]] || {};
    }

    if (lastName) base = base[lastName] = value
    return base;
  };

  constructor(props: {
    take?: number;
    skip?: number;
    orderBy?: string
    direction?: OrderByProps
    q?: string
    in?: string
    allowedFieldsToSearch: (keyof Entity)[] & string[],
    defaultOrderBy?: OrderByNested
    defaultWhere?: any
  }) {
    super({
      direction: props.direction,
      orderBy: props.orderBy,
      skip: props.skip,
      take: props.take,
      defaultOrderBy: props.defaultOrderBy
    })

    const allowedKeys = ["take", `filter`, "skip", "orderBy", `defaultWhere`, `defaultOrderBy`, "direction", "q", "in", "allowedFieldsToSearch"]

    Object.keys(props || {}).forEach(key => {
      if (!allowedKeys.includes(key)) {
        throw new ValidationException(`Query não permitida. Key ${key} não permitida`)
      }
    })

    this.where = undefined

    if (props?.in && props?.q && props?.allowedFieldsToSearch) {
      const fields = props?.in.split(",");

      const OR = fields.reduce((accumulator, field) => {

        let objeto_temporario = {}

        if (!props?.allowedFieldsToSearch.includes(field)) {
          throw new ValidationException(`Query não permitida. Campos permitidos ${props?.allowedFieldsToSearch.join(", ")}`)
        }
        this.createNestedObject(objeto_temporario, field.split("."), { contains: props.q })

        accumulator.push(objeto_temporario);
        return accumulator
      }, [] as any)

      this.where = {
        ...props.defaultWhere,
        OR
      }
    }
    else if (props?.in || props?.q) {
      if (!props?.allowedFieldsToSearch) {
        throw new ValidationException(`Query não permitida. Erro interno nos campos permitidos`)
      }
      else {
        throw new ValidationException(`Query não permitida. Obrigatório composição de 'q' e 'in'`)
      }
    }
    else {
      this.where = {
        ...props.defaultWhere,
      }
    }
  }

}
