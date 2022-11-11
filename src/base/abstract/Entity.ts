
import { isUUID } from "class-validator"
import { v4 as uuid, validate as validateUUID } from "uuid"
import { UnprocessableEntityException } from "../errors"
import { EntityNumberOptions, EntityOptions, EnumMap, Optional } from "../interface/Entity"
import { exists } from "../utils/Exists"

export class Entity {
  protected setRelationship(props: unknown, RelationshipMapper: any, self: unknown) {
    Object.keys(RelationshipMapper).forEach(field => {
      if (exists(props[field])) {

        self[field] = props[field] instanceof Array
          ? props[field].map((thisProps: unknown) => new RelationshipMapper[field](thisProps))
          : new RelationshipMapper[field](props[field])


      }
    })
  }

  static SafeCopy<EntityCopy>(obj: EntityCopy): EntityCopy {
    return JSON.parse(JSON.stringify(obj)) as EntityCopy
  }
  static Mask = {
    email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,20})/,
    zipcode: /^[0-9]{5}-[0-9]{3}$/,
    cnpj: /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/,
    cpf: /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/,
    phone: /\(\d{2}\)\s\d{4,5}\-\d{4}$/
  }

  private static EnsureRegexMask(k: string, options?: EntityOptions) {
    if (options?.mask) {
      const match = k.match(options.mask)

      if (!match) throw new UnprocessableEntityException(k + " está no formato errado! Espera-se receber o tipo: " + options.mask)
    }
  }
  private static EnsureLength(k: string, options?: EntityOptions) {
    if (options?.length) {
      const [min, max] = options.length.length === 1
        ? [options.length[0], options.length[0]]
        : [options.length[0], options.length[1]];

      const trimmed = k.trim()
      if ((trimmed.length < min) || (trimmed.length > max)) {
        throw new UnprocessableEntityException(`Campo ${k} deve ter entre ${min} e ${max} caracteres.`);
      }
    }
  }
  private static EnsureLengthNumber(k: number, options?: { length?: number[] }) {
    if (options?.length) {
      const [min, max] = options.length.length === 1
        ? [options.length[0], options.length[0]]
        : [options.length[0], options.length[1]];

      if (k < min || k > max) {
        throw new UnprocessableEntityException(`Campo ${k} deve ter entre ${min} e ${max} caracteres.`);
      }
    }
  }
  private static IsString(k: string) {
    if (!k || typeof k !== "string") {
      throw new UnprocessableEntityException(`String não válida. valor: ${k}`);
    }
  }

  private static IsNumber(k: number) {
    if (!(typeof k === `number` && (isFinite(k)) && (!isNaN(k))))
      throw new UnprocessableEntityException(`Número não válido: ${k}`);
  }
  protected static OptionalNumber(k?: number, options?: Optional<EntityNumberOptions>) {
    if (typeof k !== "number" || isNaN(k) || !isFinite(k)) {
      return (typeof options?.defaultValue === "number")
        ? options.defaultValue
        : undefined
    }
    Entity.EnsureLengthNumber(k, options)
    return k
  }
  protected static Picker(k: string, options: string[]) {

    Entity.IsString(k)

    if (!options.includes(k))
      throw new UnprocessableEntityException(`${k} Opção inválida selecionada. Selecione um dos valores a seguir ${options.join(", ")}`)

    return k
  }
  protected static OptionalPicker(k: string, options: string[]) {
    if (!k) return null
    Entity.IsString(k)

    if (!options.includes(k))
      throw new UnprocessableEntityException(`${k} Opção inválida selecionada. Selecione um dos valores a seguir ${options.join(", ")}`)

    return k
  }
  protected static OptionalUUID(k: string) {
    if (!k) return null
    if (typeof k !== "string") {
      throw new UnprocessableEntityException(`ID Não válido`);
    }
    if (!validateUUID(k)) {
      throw new UnprocessableEntityException(`ID Inválido, não é do tipo uuid.`)
    }
    return k

  }
  protected static OptionalString(k?: string, options?: Optional<EntityOptions>) {
    if (typeof k !== "string" || !k) {
      return (typeof options?.defaultValue === "string")
        ? options.defaultValue
        : undefined
    }
    Entity.EnsureLength(k, options)
    Entity.EnsureRegexMask(k, options)
    return k.trim()
  }
  protected static OptionalDate(k?: Date, options?: { defaultValue: Date }) {
    if (!k) {
      if (!options?.defaultValue) {
        throw new UnprocessableEntityException("Valor default necessário para datas opcionais.");
      }

      return new Date(options?.defaultValue)
    }

    return new Date(k)
  }
  protected static RequiredBuffer(k: Buffer) {
    if (!k) {
      throw new UnprocessableEntityException(`Expected file to be buffer`)
    }

    if (!Buffer.isBuffer(k)) {
      throw new UnprocessableEntityException(`expected "file" to be Buffer`)
    }
    return k
  }
  protected static OptionalBoolean(k?: boolean, options?: Optional<{}>) {
    if (typeof k !== "boolean") {
      return (typeof options?.defaultValue === "boolean")
        ? options.defaultValue
        : undefined
    }
    return k
  }
  protected static RequiredText(k: string, options: EntityOptions) {
    Entity.IsString(k)
    Entity.EnsureLength(k, options)
    Entity.EnsureRegexMask(k, options)
    return k.trim()
  }
  protected static RequiredNumber(k: number, options?: EntityNumberOptions) {
    Entity.IsNumber(k)
    Entity.EnsureLengthNumber(k, options)
    return k

  }
  protected static RequiredEmail(k: string, options?: { length: number[] }) {
    Entity.IsString(k);
    Entity.EnsureLength(k, options);

    if (k.startsWith("@")) {
      throw new UnprocessableEntityException(`Formato de email não válido.`)
    }
    //implement mask

    return k.trim();
  }
  protected static createUUID(k?: string) {
    if (!k) { return uuid(); }
    if (typeof k !== "string") {
      throw new UnprocessableEntityException(`ID Não válido`);
    }
    if (!validateUUID(k)) {
      throw new UnprocessableEntityException(`ID Inválido, não é do tipo uuid.`)
    }
    return k.trim();
  }
  protected static createRequiredId(k: string) {
    Entity.IsString(k);
    if (!isUUID(k)) {
      throw new UnprocessableEntityException(`ID Inválido, não é do tipo uuid.`)
    }
    return k.trim();
  }
  protected static OptionalEnum<T>(k: T, options: { enum: EnumMap<T>, defaultValue?: T }): T {
    if (!k) return options?.defaultValue;

    if (!options.enum.hasOwnProperty(k as unknown as string)) {
      throw new UnprocessableEntityException(`Enum não válido. ${Object.keys(options?.enum || {}).join(`, `)} `);
    }
    return k
  }
  protected static RequiredEnum<T>(k: T, options: { enum: EnumMap<T> }): T {
    if (!k) throw new UnprocessableEntityException(`Enum não válido. ${Object.keys(options?.enum || {}).join(`, `)} `);

    if (!options.enum.hasOwnProperty(k as unknown as string)) {
      throw new UnprocessableEntityException(`Enum não válido. ${Object.keys(options?.enum || {}).join(`, `)} `);
    }
    return k
  }
  protected static RequiredDate(k: Date) {
    if (!k) {
      throw new UnprocessableEntityException(`Formato de data inválido.`)
    }

    return new Date(k)
  }

  protected static CreatedAt(k?: Date) {
    if (!k) return new Date()
    else return k
  }
  protected static UpdatedAt() {
    return new Date()
  }



}
