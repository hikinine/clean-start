import { developerCliService } from "../DeveloperCli";
import { DeveloperCreateUsecaseController } from "./DeveloperCreateUsecaseController";
import { DeveloperCreateUsecaseService } from "./DeveloperCreateUsecaseService";

const service = new DeveloperCreateUsecaseService({
  services: {
    cli: developerCliService
  }
});
const developerCreateUsecaseController = new DeveloperCreateUsecaseController(service)

export { developerCreateUsecaseController };

