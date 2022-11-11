import fs, { readdirSync } from "fs";
import { resolve } from "path";
export class DeveloperCliService {

  public allowedFileExtensions = ".ts"
  public baseCorePath = "../../../../../../core"

  async getFiles(dir: string): Promise<string[]> {
    const dirents = fs.readdirSync(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
      const res = resolve(dir, dirent.name);
      return dirent.isDirectory() ? this.getFiles(res) : res;
    }));
    return Array.prototype.concat(...files);
  }

  async execute(dto: unknown) {
    const thisPath = resolve(__dirname, this.baseCorePath + "/repositories")
    const repositories = fs.readdirSync(thisPath, { withFileTypes: true })
      .filter(dir => dir.name.endsWith(this.allowedFileExtensions))
      .map(dir => dir.name.replace(".ts", ""))
    const thisPathimplementations = resolve(__dirname, this.baseCorePath + "/repositories/implementation")
    const implementation = fs.readdirSync(thisPathimplementations, { withFileTypes: true })
      .filter(dir => dir.name.endsWith(this.allowedFileExtensions))
      .map(dir => dir.name.replace(".ts", ""))

    let modules = readdirSync(resolve(__dirname, this.baseCorePath + "/usecase"));
    let middlewares = readdirSync(resolve(__dirname, "../../../middleware"))
      .filter(middleware => middleware !== "index.ts")
      .map(middleware => middleware.replace(".ts", ""))


    const entities = readdirSync(resolve(__dirname, this.baseCorePath + "/domain/entities"))
      .filter(entity => entity !== "__test__")


    return { repositories, modules, middlewares, entities, implementation }
  }
}