import { DeveloperCliController } from "./DeveloperCliController";
import { DeveloperCliService } from "./DeveloperCliService";

export const developerCliService = new DeveloperCliService()
export const developerCliController = new DeveloperCliController(developerCliService)

