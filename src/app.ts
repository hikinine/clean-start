import "dotenv/config";
import EventEmitter from "events";
import "reflect-metadata";
import { AuthenticateModule } from './core/usecase/Authenticate/authenticate.modules';
import { UserModule } from './core/usecase/User/user.modules';
import { ApplicationContainer } from "./shared/container/application.container";
import { config } from "./shared/infra/config";
import { ExpressHttpServer } from "./shared/infra/http/server.app";

async function bootstrap() {
  const server = new ExpressHttpServer({ port: Number(config.httpPort) })
  const dispatcher = new EventEmitter();
  const container = new ApplicationContainer([
    UserModule,
    AuthenticateModule
  ]);

  container
    .installModules()
    .installRoute(server)
    .installListeners(dispatcher)
    .installDeveloperRoute(server)
    .free()

}
bootstrap()


process.on("uncaughtException", console.log)