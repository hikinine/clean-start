import ejs from "ejs";
import fs from "fs";
import { resolve } from 'path';

import { DeveloperCreateRepositoryDTO } from "./DeveloperCreateRepositoryController";

export class DeveloperCreateRepositoryService {


  constructor() { }

  async execute(dto: DeveloperCreateRepositoryDTO) {
    const props = {
      Entity: dto.name.replace("Repository", ""),
      entity: dto.name.replace("Repository", "").toLowerCase(),
      Repository: dto.name,
      Implementation: dto.implementation + dto.name
    }

    const [repository, implementation] = [
      fs.readFileSync(resolve(__dirname, "./templates/repository.ejs")),
      fs.readFileSync(resolve(__dirname, "./templates/implementation.ejs")),
      
    ]

    const [repositoryTemplate, implementationTemplate] = [
      ejs.compile(repository.toString("utf-8")),
      ejs.compile(implementation.toString("utf-8")),

    ]
    const [repo, imp] = [
      repositoryTemplate({ props }),
      implementationTemplate({ props }),

    ]

    fs.writeFileSync(
      resolve(__dirname, "../../../../../../core/repositories/" + dto.name + ".ts"),
      Buffer.from(repo),
      { encoding: "utf-8" }
    )

    fs.writeFileSync(
      resolve(__dirname, "../../../../../../core/repositories/implementation/" + props.Implementation + ".ts"),
      Buffer.from(imp),
      { encoding: "utf-8" }
    )


  }
}