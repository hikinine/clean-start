import { bind, BindRoutes } from "../middleware";
import { developerCliController } from "./usecase/DeveloperCli";
import { developerCreateRepositoryController } from './usecase/DeveloperCreateRepository/index';
import { developerCreateUsecaseController } from './usecase/DeveloperCreateUsecase/';

export class DeveloperCliBindController {
  static basePath = "/developer-cli"
  static baseMiddleware = []

  static routes = [
    {
      method: "get",
      path: "/",
      controller: function (req, res) { res.render("pages/index") },
      middleware: []
    },
    {
      method: "get",
      path: "/api",
      controller: bind(developerCliController),
      middleware: []
    },
    {
      method: "post",
      path: "/api",
      controller: bind(developerCreateUsecaseController),
      middleware: []
    },
    {
      method: "post",
      path: "/api/repository",
      controller: bind(developerCreateRepositoryController),
      middleware: []
    }
  ] as BindRoutes[]
}