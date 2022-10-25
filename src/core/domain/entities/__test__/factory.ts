

import { UserProps } from './../User';
import { v4 } from "uuid"


export class EntityFactory {

  static UserValid = (props?: Partial<UserProps>): UserProps => ({
    name: "Paulo Santana",
    email: "paulo.artlab@gmail.com",
    password: "12345678",
    phone: "(71) 99295-6282",
    ...props,
  })
}