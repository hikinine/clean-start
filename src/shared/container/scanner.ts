const dirTree = require("directory-tree")
import { resolve } from "path";


export interface DirectoryTree {
  path: string
  name: string
  children?: Array<DirectoryTree>
}

export class ModuleScanner {
  public filenames = [] as string[]

  private options: {
    startsFrom?: string,
    extensions?: RegExp
  }

  constructor(props?: {
    startsFrom?: string,
    extensions?: RegExp
  }) {
    const options = {} as any
    options.startsFrom = props?.startsFrom || resolve(__dirname, "../../core");
    options.extensions = props?.extensions || /\.ts/
    this.filenames = []

    this.options = options
    this.scan()

  }
  private recursiveScanner(dir: DirectoryTree) {
    if (dir?.path?.endsWith(".ts")) {
      if (!(dir.path.includes(".spec.ts") || dir.path.includes(".test.ts"))) {
        this.filenames.push(dir.path)
      }
    }
    if (dir?.children?.length) {
      for (let thisDir of dir?.children) {
        this.recursiveScanner(thisDir)
      }
    }
  }
  private scan() {

    const tree = dirTree(this.options.startsFrom, this.options.extensions);
    return this.recursiveScanner(tree)
  }
}

