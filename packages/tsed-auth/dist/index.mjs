var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/decorator/AuthContextProvider.ts
import { useDecorators } from "@tsed/core";
import { Injectable } from "@tsed/di";
var AUTH_CONTEXT_PROVIDER_TYPE = "tsed-auth:context-provider";
function AuthContextProvider(options) {
  options != null ? options : options = {};
  options.type = AUTH_CONTEXT_PROVIDER_TYPE;
  return useDecorators(Injectable(options));
}
__name(AuthContextProvider, "AuthContextProvider");

// src/decorator/UseAuth.ts
import { useDecorators as useDecorators2 } from "@tsed/core";
import { UseAuth as BaseUseAuth } from "@tsed/common";

// src/guard/AuthMiddleware.ts
import { Middleware, Req, Context, Inject, InjectorService, Logger, Constant } from "@tsed/common";
import * as jexl from "jexl";
import { Forbidden, InternalServerError, Unauthorized } from "@tsed/exceptions";
import { Env } from "@tsed/core";
var __decorate = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = function(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
};
var __param = function(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
};
var AuthMiddleware = /* @__PURE__ */ __name(class AuthMiddleware2 {
  constructor() {
    this.expressionEvaluator = new jexl.Jexl();
    this.expressionEvaluator.removeOp("=");
    this.expressionEvaluator.addTransform("exists", (val) => {
      return typeof val !== "undefined" && val !== null;
    });
  }
  get contextProviders() {
    return this.injector.getMany(AUTH_CONTEXT_PROVIDER_TYPE);
  }
  getProtoName(obj) {
    var _a;
    if (typeof obj === "undefined")
      return "undefined";
    if (obj === null)
      return "null";
    return (_a = Object.getPrototypeOf(obj).name) != null ? _a : typeof obj;
  }
  async buildContext(context) {
    const contextProviderContext = {};
    this.logger.info("[AuthMiddleware]: Providers: ", this.contextProviders);
    for (const contextProvider of this.contextProviders) {
      this.logger.info(`[AuthMiddleware]: Get Context from ${this.getProtoName(contextProvider)}`);
      Object.assign(contextProviderContext, await contextProvider.getContext(context));
    }
    return __spreadProps(__spreadValues({}, contextProviderContext), {
      routeParams: context.request.params,
      queryParams: context.request.query,
      session: context.request.session,
      cookies: context.request.cookies,
      request: context.request
    });
  }
  async use(request, ctx) {
    var _a, _b;
    this.logger.info(`[AuthMiddleware]: Running for ${ctx.request.url}`);
    const options = ctx.endpoint.get(AuthMiddleware2);
    let isAuthenticated = false;
    try {
      const expressionContext = await this.buildContext(ctx);
      this.logger.info(`[AuthMiddleware]: Context build, going to evaluate "${options.expression}"`);
      isAuthenticated = await this.expressionEvaluator.eval(options.expression, expressionContext);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerError("Could not authorize route", this.env === Env.DEV ? e : null);
    }
    if (typeof isAuthenticated !== "boolean") {
      this.logger.warn(`[AuthMiddleware]: The return value of expression "${options.expression}" on "${ctx.request.url}" was not a boolean (was ${this.getProtoName(isAuthenticated)})`);
      this.logger.info(`[AuthMiddleware]: Value of expression is:
`, isAuthenticated);
      throw new Unauthorized((_a = options.unauthorizedMessage) != null ? _a : "");
    }
    if (!isAuthenticated)
      throw new Forbidden((_b = options.forbiddenMessage) != null ? _b : "");
  }
}, "AuthMiddleware");
__decorate([
  Inject(),
  __metadata("design:type", typeof InjectorService === "undefined" ? Object : InjectorService)
], AuthMiddleware.prototype, "injector", void 0);
__decorate([
  Inject(),
  __metadata("design:type", typeof Logger === "undefined" ? Object : Logger)
], AuthMiddleware.prototype, "logger", void 0);
__decorate([
  Constant("env"),
  __metadata("design:type", typeof Env === "undefined" ? Object : Env)
], AuthMiddleware.prototype, "env", void 0);
__decorate([
  __param(0, Req()),
  __param(1, Context()),
  __metadata("design:type", Function),
  __metadata("design:paramtypes", [
    typeof Req === "undefined" ? Object : Req,
    typeof Context === "undefined" ? Object : Context
  ])
], AuthMiddleware.prototype, "use", null);
AuthMiddleware = __decorate([
  Middleware(),
  __metadata("design:type", Function),
  __metadata("design:paramtypes", [])
], AuthMiddleware);

// src/decorator/UseAuth.ts
import { Returns } from "@tsed/schema";
import { Forbidden as Forbidden2, InternalServerError as InternalServerError2, Unauthorized as Unauthorized2 } from "@tsed/exceptions";
var USE_AUTH_DATA_KEY = "tsed-entity-mapper:use-auth";
function UseAuth(expression, options) {
  var _a, _b;
  let _options = options != null ? options : {};
  _options.expression = expression;
  return useDecorators2(BaseUseAuth(AuthMiddleware, _options), Returns(401, Unauthorized2).Description((_a = _options.unauthorizedMessage) != null ? _a : "Unauthorized"), Returns(403, Forbidden2).Description((_b = _options.forbiddenMessage) != null ? _b : "Forbidden"), Returns(500, InternalServerError2).Description("Internal Server Error"));
}
__name(UseAuth, "UseAuth");
export {
  AUTH_CONTEXT_PROVIDER_TYPE,
  AuthContextProvider,
  AuthMiddleware,
  USE_AUTH_DATA_KEY,
  UseAuth
};
