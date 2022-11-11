import cors from "cors";
import express, { Express, Router } from "express";
import { config } from "../config";

interface InstallExpressOptions {
  jsonLimit?: string
  urlencoded?: boolean
  disableCors?: boolean
  port?: number
  onReady?: () => void
}

class ApplicationHttpServer {

}
class ExpressHttpServer extends ApplicationHttpServer {
  public app: Express
  public route: Router

  constructor(options?: InstallExpressOptions) {
    super()
    const app = express();

    app.set('view engine', 'ejs');

    app.use(express.json({ limit: options?.jsonLimit || "50mb" }));
    app.use(express.urlencoded({ extended: options?.urlencoded || true }));

    if (!options.disableCors) {
      app.use(cors());
    }

    app.listen(
      options?.port || config.httpPort,
      options?.onReady || config.httpOnReady
    );

    const route = Router({ mergeParams: true })
    this.app = app
    this.route = route
  }
}

export { ApplicationHttpServer, ExpressHttpServer };

