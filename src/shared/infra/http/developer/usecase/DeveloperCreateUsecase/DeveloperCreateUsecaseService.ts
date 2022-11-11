import ejs from "ejs";
import fs from 'fs';
import { resolve } from 'path';
import { formatRepository } from "../../../../../../base/utils/format-repository";
import { DeveloperCliService } from './../DeveloperCli/DeveloperCliService';
import { DeveloperCreateUsecaseDTO } from "./DeveloperCreateUsecaseController";
export class DeveloperCreateUsecaseService {
  private services: {
    cli: DeveloperCliService
  }
  constructor(props: { services: { cli: DeveloperCliService } }) {
    this.services = props.services
  }

  uncapitalize(str: string) {
    return str.charAt(0).toLowerCase() + str.slice(1)
  }
  capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
  private autoModules = ["controller", "dto", "service"]

  async execute(dto: DeveloperCreateUsecaseDTO) {
    const { implementation } = await this.services.cli.execute({})


    const usecase = this.uncapitalize(dto.usecase)
    const USECASE = this.capitalize(dto.usecase)
    const props = {
      usecase: this.uncapitalize(dto.usecaseModule),
      USECASE: this.capitalize(dto.usecaseModule),
      controller: usecase + "Controller",
      service: usecase + "Service",
      Controller: USECASE + "Controller",
      DTO: USECASE + "DTO",
      Service: USECASE + "Service",
      keyRepositories: dto.repositories.map(repo => formatRepository(repo.replace("Repository", ""))),
      Repositories: dto.repositories,
      Implementation: dto.repositories.map(repository => {
        return implementation.find(imp => imp.includes(repository));
      }),

      extra: {
        params: dto.path.includes(":") && dto.path.match(/:(\w+)/g)?.[0]?.replace(":", ""),
        path: dto.path,
        method: dto.method.charAt(0).toUpperCase() + dto.method.slice(1)
      }
    }


    this.autoModules.forEach(thisModule => {
      const selfModule = fs.readFileSync(resolve(__dirname, "./templates/" + thisModule + ".ejs"))

      const template = ejs.compile(selfModule.toString("utf-8"))
      const result = template({ props })

      const moduleName = thisModule === "index" ? "index" : USECASE + (thisModule === "dto" ? thisModule.toUpperCase() : this.capitalize(thisModule))

      try {
        fs.mkdirSync(resolve(__dirname, this.services.cli.baseCorePath + "/usecase/" + dto.usecaseModule + "/" + USECASE))

      } catch (error) {
      }
      fs.writeFileSync(
        resolve(__dirname, this.services.cli.baseCorePath + "/usecase/" + dto.usecaseModule + "/" + USECASE + "/" + moduleName + ".ts"),
        Buffer.from(result),
        { encoding: "utf-8" }
      )
    })

    return { ok: true }
  }
}