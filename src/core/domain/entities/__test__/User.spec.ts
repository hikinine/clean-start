import { UserAuthenticate } from './../UserAuthenticate';

import { RefreshToken } from '../UserRefreshToken';
import { UnprocessableEntityException } from './../../../../base/errors/UnprocessableEntityException';
import { defaultNonStringValues, string, forceLimits, defaultNonNumberValues } from './../../../../base/utils/testFactory';
import { User, UserProps } from './../User';
import { v4, validate as validateUUID } from 'uuid';
import { EntityFactory } from './factory';


describe("Entidade do domínio -> USER", () => {
  let ForceLimits: (props: any) => void;

  beforeAll(() => {


    ForceLimits = (props: {
      field: any,
      valid: any,
      invalid: any
    }) => {
      return forceLimits({
        Entity: User,
        InstanceOfException: UnprocessableEntityException,
        validEntityPayload: EntityFactory.UserValid(),
        field: props.field,
        invalid: props.invalid,
        valid: props.valid
      })
    }

  })

  it("Está definido", () => {
    expect(User).toBeDefined()
    expect(User.prototype).toBeDefined()
    expect(User.name).toEqual("User")
  })

  it("Criar um usuário válido", () => {
    const validEntityPayload = EntityFactory.UserValid()
    const user = new User({ ...validEntityPayload })
    expect(user).toBeInstanceOf(User)

    expect(user.privilege).toEqual(
      typeof validEntityPayload?.privilege === "undefined"
        ? 0
        : validEntityPayload?.privilege
    );
    expect(user.role).toEqual(
      typeof validEntityPayload?.role === "undefined"
        ? 0
        : validEntityPayload?.role
    );
    expect(user.status).toEqual(
      typeof validEntityPayload?.status === "undefined"
        ? true
        : validEntityPayload?.status
    );
  });


  it("Testar possiveis relacionamentos", () => {
    const [userId] = [v4()]

    const user = new User({
      ...EntityFactory.UserValid({
        id: userId,
        refreshToken: new RefreshToken({ userId }),
      })
    })

    expect(user).toBeInstanceOf(User)
    expect(user.refreshToken).toBeInstanceOf(RefreshToken)
  })
  it("[LIMIT] name", () => {
    const valid = [string(3), string(70), "Algum Nome Qualquer"] as any
    const invalid = [...defaultNonStringValues, "", string(2), string(71)] as any

    ForceLimits({
      field: "name",
      invalid,
      valid,
    })
  })

  it("[LIMIT] email", () => {
    const valid = ["paulo@gmail.com", "paulo@newsun.energy"]
    const invalid = [...defaultNonStringValues, "", string(3), string(101)]

    ForceLimits({
      field: "email",
      invalid,
      valid
    })
  })
  it("[LIMIT] password", () => {

    const valid = ["12345678", string(6), string(100), "xd@20240"]
    const invalid = [...defaultNonStringValues, string(5), string(101)]

    ForceLimits({
      field: "password",
      invalid,
      valid
    })
  })
  it("[LIMIT] phone", () => {

    const valid = ["(71) 99295-6282"]
    const invalid = [...defaultNonStringValues, string(100), string(13), string(16)]

    ForceLimits({
      field: "phone",
      invalid,
      valid
    })
  })
  it("[LIMIT] privilege", () => {

    const valid = [0, 1, undefined, ...defaultNonNumberValues, ...defaultNonStringValues]
    const invalid = []

    ForceLimits({
      field: "privilege",
      invalid,
      valid
    })
  })
  it("[LIMIT] role", () => {

    const valid = [0, 1, undefined, ...defaultNonNumberValues, ...defaultNonStringValues]
    const invalid = []

    ForceLimits({
      field: "role",
      invalid,
      valid
    })
  })
  it("[LIMIT] status", () => {

    const valid = [0, 1, undefined, ...defaultNonNumberValues, ...defaultNonStringValues]
    const invalid = []

    ForceLimits({
      field: "status",
      invalid,
      valid
    })
  })

  it("Verifica se a senha está correta", () => {
    const decodedPassword = "12345678"
    const encodedPassword = "$2a$12$uwvPlmFxmaG5F//jjxOK2Ob2q0qcoizobDkmnb6rxCuT2u9lrgPiq"

    const user = new User({
      ...EntityFactory.UserValid({ password: encodedPassword })
    })

    expect(user).toBeInstanceOf(User)
    expect(() => user.ensureEncryptedPasswordMatchWith(decodedPassword))
      .not.toThrow()
  })

  it("Verifica se usuário tem refresh token", () => {
    const userWithoutToken = new User(EntityFactory.UserValid())
    const userWithToken = new User({
      ...EntityFactory.UserValid({
        refreshToken: new RefreshToken({ userId: userWithoutToken.id })
      }),
    })

    expect(userWithoutToken).toBeInstanceOf(User)
    expect(userWithoutToken.hasRefreshToken()).toEqual(false)

    expect(userWithToken).toBeInstanceOf(User)
    expect(userWithToken.hasRefreshToken()).toEqual(true)
  })

  it("Verifica generateUserSignInPayload", () => {
    const user = new User(EntityFactory.UserValid());
    const authenticate = new UserAuthenticate(user, { expiresIn: User.DEFAULT_EXPIRES_IN });
    const { accessToken, payload } = authenticate;

    expect(payload.id).toBeDefined();
    expect(validateUUID(payload.id)).toBeTruthy();
    expect(typeof payload.privilege).toEqual("number");
    expect(typeof payload.role).toEqual("number");

    const decoded = authenticate.decodeIn(accessToken)
    expect(decoded.sub).toEqual(user.id)
    expect(decoded.id).toEqual(user.id)
    expect(decoded.privilege).toEqual(user.privilege)
    expect(decoded.role).toEqual(user.role)
  })

})

