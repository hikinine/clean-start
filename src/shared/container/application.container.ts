import { EventEmitter } from "node:events";
import { ControllerMetadata, HttpInterceptorMetadata } from '../../base/decorators/Controller';
import { ListenerMetadata } from "../../base/decorators/Listener";
import { ModuleMetadata } from "../../base/decorators/Module";
import { ProviderMetadata } from '../../base/decorators/Provider';
import { RepositoryMetadata } from "../../base/decorators/Repository";
import { BadRequest } from '../../base/errors/BadRequestException';
import { ApplicationContainerModules, Dependencies, Listeners, RegisterRoute, Route } from '../../base/interface/container';
import { prismaInstance } from '../infra/database/prisma/client';
import { DeveloperCliBindController } from '../infra/http/developer/bind';
import { bind, interceptAndLogger } from '../infra/http/middleware';
import { Controller } from '../infra/http/middleware/bind';
import { ExpressHttpServer } from "../infra/http/server.app";
import { MetadataKeys } from "./application.container.constants";
import { ModuleScanner } from "./scanner";

export class ApplicationContainer {
  private modules = new Map<string, { instance: ApplicationContainerModules, alias?: string[] }>()
  private routes = [] as Array<Route>
  private listeners = [] as Array<Listeners>
  private temp = {
    repositories: [],
    controllers: [],
    events: [],
    providers: []
  }

  constructor(private applicationModules: Array<any>) { }

  bind(dependencies: Dependencies) {
    const { key, instance, alias } = dependencies
    this.modules.set(key, { alias: alias || [], instance })
  }

  resolve<T extends unknown = any>(key: string | Function): T {

    let moduleKey = typeof key === "string" ? key : key.name

    if (this.modules.has(moduleKey))
      return this.modules.get(moduleKey).instance as T

    for (const [$, module] of this.modules) {
      if (typeof module.alias === "object" && module.alias.includes(moduleKey)) {
        return module.instance as T
      }
    }
    return null as T


  }

  private installControllersHttpAndListeners() {
    function build(
      constructor: Function,
      metadata: (ControllerMetadata & HttpInterceptorMetadata) | ListenerMetadata
    ) {
      const constructorArgs = []
      const alias = this.getServiceAlias(metadata.id)
      const service = this.resolve(alias)

      const providerMetadata: ProviderMetadata = Reflect.getMetadata(
        MetadataKeys.Provider,
        service.constructor
      )

      if (!providerMetadata) {
        return this.BadResolveDependency({ alias, metadata })
      }

      const moduleMetadata: ModuleMetadata = Reflect.getMetadata(
        MetadataKeys.Modules,
        providerMetadata?.moduleGenerator
      )

      if (!moduleMetadata || !this.applicationModules.includes(providerMetadata?.moduleGenerator)) {
        return this.BadResolveDependency({ alias, metadata })
      }

      constructorArgs.push({ service, exceptionController: moduleMetadata.controller.exceptionHandler })
      const instance = Reflect.construct(constructor, constructorArgs)
      this.bind({ instance, key: instance.constructor.name })
    }

    this.temp.controllers.forEach(constructor => {
      const metadata: ControllerMetadata & HttpInterceptorMetadata = {
        ...Reflect.getMetadata(MetadataKeys.Controller, constructor),
        ...Reflect.getMetadata(MetadataKeys.HttpRoute, constructor)
      }
      if (metadata) {
        build.call(this, constructor, metadata)
        this.registerRoute(metadata)
      }
    })
    this.temp.events.forEach(constructor => {
      const metadata: ListenerMetadata = Reflect.getMetadata(
        MetadataKeys.Events,
        constructor
      )
      if (metadata) {
        build.call(this, constructor, metadata)
        this.registerListener(metadata)
      }
    })

    return this
  }

  private installServices() {

    function build(provider: any) {
      const providerMetadata: ProviderMetadata = Reflect.getMetadata(
        MetadataKeys.Provider,
        provider
      )
      if (
        providerMetadata &&
        providerMetadata?.moduleGenerator &&
        this?.applicationModules?.includes(providerMetadata?.moduleGenerator)
      ) {
        const metadata: ModuleMetadata = Reflect.getMetadata(
          MetadataKeys.Modules,
          providerMetadata?.moduleGenerator
        );

        const constructorArgs = []
        const repository = {}
        const services = {}

        for (const implementation of metadata.service.repositories) {
          const repositoryMetadata: RepositoryMetadata = Reflect.getMetadata(
            MetadataKeys.Repository,
            implementation
          );
          const { id, shortId } = repositoryMetadata
          const resolvedDependency = this.resolve(id)

          if (!resolvedDependency) {
            return this.BadResolveDependency({ id, repositoryMetadata, implementation })
          }
          repository[shortId] = resolvedDependency
        }

        for (const thisProvider of metadata.service.providers) {

        }
        constructorArgs.push({ repository, services })
        const instance = Reflect.construct(provider, constructorArgs)
        const instanceExists = this.resolve(instance.constructor.name)
        if (!instanceExists) {
          this.bind({
            instance,
            key: instance.constructor.name,
            alias: [
              this.createServiceAlias(instance.constructor.name)
            ]
          })
        }
      }
    }

    for (const provider of this.temp.providers) {
      build.call(this, provider)
    }
    return this
  }
  private installScanner() {
    const { filenames } = new ModuleScanner()
    for (const filename of filenames) {
      const exported = require(filename)
      for (const m in exported) {
        const $module = exported[m]
        if (typeof $module === "function") {
          const metadatasKeys = Reflect.getMetadataKeys($module)
          if (!metadatasKeys.length) {
            continue;
          }
          if (metadatasKeys.includes(MetadataKeys.Repository)) {
            this.temp.repositories.push($module)
          }
          if (metadatasKeys.includes(MetadataKeys.Provider)) {
            this.temp.providers.push($module)
          }
          if (metadatasKeys.includes(MetadataKeys.Events)) {
            this.temp.events.push($module)
          }
          if (metadatasKeys.includes(MetadataKeys.HttpRoute) || metadatasKeys.includes(MetadataKeys.Controller)) {
            this.temp.controllers.push($module)
          }
        }
      }
    }
    return this
  }

  private installRepositories() {
    this.temp.repositories.forEach(repository => {
      const metadata: RepositoryMetadata = Reflect.getMetadata(MetadataKeys.Repository, repository);
      if (metadata) {
        const context = metadata?.contextPrisma ? prismaInstance : undefined
        const instance = repository.getInstance(context)
        this.bind({
          instance,
          key: metadata.id,
          alias: [
            metadata.interface,
            metadata.shortId
          ]
        });
      }
    })
    return this
  }

  private registerRoute(props: RegisterRoute) {
    this.routes.push({ ...props, controller: null, waitingInstall: true })
  }
  private registerListener(listener: Listeners) {
    this.listeners.push(listener)
  }
  installListeners(dispatcher: EventEmitter) {
    this.modules.forEach(($module, id) => {
      const listener = this.listeners.find((listen) => listen.id === id)
      if (!listener) return

      dispatcher.on(listener.eventName, ($module.instance as Controller).handle.bind($module))
    })
    return this
  }
  installRoute(server: ExpressHttpServer) {
    this.routes
      .map((route: Route) => {
        let resolved = this.resolve(route.controllerKey);
        if (!resolved)
          throw new Error("falha no resolve")

        const controller = bind(resolved)
        Object.defineProperty(controller, "name", { value: route.controllerKey })
        Object.defineProperty(route, "controller", { value: controller })

        return route
      })
      .sort((route: Route) => route.path.includes(":") ? 1 : -1)
      .filter((route: Route) => route.waitingInstall)
      .forEach((route: Route) => {
        const { controller, method, middleware, path } = route
        server.route[method](path, ...middleware, interceptAndLogger, controller)
        route.waitingInstall = false
      })

    server.app.use("/v1", server.route)
    return this
  }

  installDeveloperRoute(server: ExpressHttpServer) {
    DeveloperCliBindController.routes.forEach(thisRoute => {
      const { controller, method, middleware, path } = thisRoute
      server.route[method](path, controller)
    })

    server.app.use("/developer-cli", server.route)
    return this
  }

  public installModules() {
    this
      .installScanner()
      .installRepositories()
      .installServices()
      .installControllersHttpAndListeners()

    return this
  }
  free() {
    delete this.temp
    delete this.applicationModules
    delete this.routes
    delete this.listeners
  }
  private BadResolveDependency(args: Object) {
    throw new BadRequest("Mal formação no AutoImport. Não consegui resolver a dependência: ", args)
  }
  private createServiceAlias(serviceName: string) {
    return serviceName.replace("Service", "Controller") + "BindServiceAlias"
  }
  private getServiceAlias(controllerName: string) {
    return controllerName + "BindServiceAlias"
  }
}
