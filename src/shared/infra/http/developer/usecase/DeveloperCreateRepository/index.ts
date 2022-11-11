import { DeveloperCreateRepositoryController } from "./DeveloperCreateRepositoryController";
import { DeveloperCreateRepositoryService } from "./DeveloperCreateRepositoryService";

const developerCreateRepositoryService = new DeveloperCreateRepositoryService()
export const developerCreateRepositoryController = new DeveloperCreateRepositoryController(developerCreateRepositoryService)