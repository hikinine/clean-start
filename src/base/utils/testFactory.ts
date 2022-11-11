import { expect } from "vitest"

export const string = (k: number) => Array(k).fill("a").join("")

export const defaultNonNumberValues = [
  null,
  undefined,
  NaN,
  Infinity,

  false,
  true,
  [],
  {},
]
export const defaultNonStringValues = [
  null,
  undefined,
  NaN,
  Infinity,
  [],
  {},
  0,
  false,
  true,
  -1,
  1,
  100
]

export const forceLimits = (props: {
  valid: any[],
  invalid: any[],
  validEntityPayload: any,
  Entity: any,
  field: string,
  InstanceOfException: any
}) => {

  const { Entity, invalid, valid, validEntityPayload, field, InstanceOfException } = props
  for (const value of valid) {
    const entityProps = { ...validEntityPayload } as typeof Entity
    entityProps[field] = value
    const entity = new Entity(entityProps)

    expect(entity).toBeInstanceOf(Entity)
  }

  for (const value of invalid) {
    try {

      const entityProps = { ...validEntityPayload } as typeof Entity
      entityProps[field] = value
      const entity = new Entity(entityProps)
      expect(entity).not.toBeInstanceOf(Entity)

    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      expect(error).toBeInstanceOf(InstanceOfException)
    }
  }


}