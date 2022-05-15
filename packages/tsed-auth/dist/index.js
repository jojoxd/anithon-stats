var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
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
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.ts
var tsed_auth_exports = {};
__export(tsed_auth_exports, {
  AUTH_CONTEXT_PROVIDER_TYPE: () => AUTH_CONTEXT_PROVIDER_TYPE,
  AuthContextProvider: () => AuthContextProvider,
  AuthMiddleware: () => AuthMiddleware,
  USE_AUTH_DATA_KEY: () => USE_AUTH_DATA_KEY,
  UseAuth: () => UseAuth
});
module.exports = __toCommonJS(tsed_auth_exports);

// src/decorator/AuthContextProvider.ts
var import_core = require("@tsed/core");
var import_di = require("@tsed/di");
var AUTH_CONTEXT_PROVIDER_TYPE = "tsed-auth:context-provider";
function AuthContextProvider(options) {
  options != null ? options : options = {};
  options.type = AUTH_CONTEXT_PROVIDER_TYPE;
  return (0, import_core.useDecorators)((0, import_di.Injectable)(options));
}
__name(AuthContextProvider, "AuthContextProvider");

// src/decorator/UseAuth.ts
var import_core3 = require("@tsed/core");
var import_common2 = require("@tsed/common");

// src/guard/AuthMiddleware.ts
var import_common = require("@tsed/common");
var jexl = __toESM(require("jexl"));
var import_exceptions = require("@tsed/exceptions");
var import_core2 = require("@tsed/core");
var import_util = require("util");
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
  }
  get contextProviders() {
    return this.injector.getAll(AUTH_CONTEXT_PROVIDER_TYPE);
  }
  async buildContext(context) {
    var _a;
    const contextProviderContext = {};
    for (const contextProvider of this.contextProviders) {
      this.logger.debug(`[AuthMiddleware]: Get Context from ${(_a = Object.getPrototypeOf(contextProvider)) == null ? void 0 : _a.name}`);
      Object.assign(contextProviderContext, await contextProvider.getContext());
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
      this.logger.info(`[AuthMiddleware]: Inspection of expressionContext:`);
      this.logger.info((0, import_util.inspect)(expressionContext, {
        depth: 3,
        colors: true
      }));
      isAuthenticated = await this.expressionEvaluator.eval(options.expression, expressionContext);
    } catch (e) {
      this.logger.error(e);
      throw new import_exceptions.InternalServerError("Could not authorize route", this.env === import_core2.Env.DEV ? e : null);
    }
    if (typeof isAuthenticated !== "boolean")
      throw new import_exceptions.Unauthorized((_a = options.unauthorizedMessage) != null ? _a : "");
    if (!isAuthenticated)
      throw new import_exceptions.Forbidden((_b = options.forbiddenMessage) != null ? _b : "");
  }
}, "AuthMiddleware");
__decorate([
  (0, import_common.Inject)(),
  __metadata("design:type", typeof import_common.InjectorService === "undefined" ? Object : import_common.InjectorService)
], AuthMiddleware.prototype, "injector", void 0);
__decorate([
  (0, import_common.Inject)(),
  __metadata("design:type", typeof import_common.Logger === "undefined" ? Object : import_common.Logger)
], AuthMiddleware.prototype, "logger", void 0);
__decorate([
  (0, import_common.Constant)("env"),
  __metadata("design:type", typeof import_core2.Env === "undefined" ? Object : import_core2.Env)
], AuthMiddleware.prototype, "env", void 0);
__decorate([
  __param(0, (0, import_common.Req)()),
  __param(1, (0, import_common.Context)()),
  __metadata("design:type", Function),
  __metadata("design:paramtypes", [
    typeof import_common.Req === "undefined" ? Object : import_common.Req,
    typeof import_common.Context === "undefined" ? Object : import_common.Context
  ])
], AuthMiddleware.prototype, "use", null);
AuthMiddleware = __decorate([
  (0, import_common.Middleware)(),
  __metadata("design:type", Function),
  __metadata("design:paramtypes", [])
], AuthMiddleware);

// src/decorator/UseAuth.ts
var import_schema = require("@tsed/schema");
var import_exceptions2 = require("@tsed/exceptions");
var USE_AUTH_DATA_KEY = "tsed-entity-mapper:use-auth";
function UseAuth(expression, options) {
  var _a, _b;
  let _options = options != null ? options : {};
  _options.expression = expression;
  return (0, import_core3.useDecorators)((0, import_common2.UseAuth)(AuthMiddleware, options), (0, import_schema.Returns)(401, import_exceptions2.Unauthorized).Description((_a = _options.unauthorizedMessage) != null ? _a : "Unauthorized"), (0, import_schema.Returns)(403, import_exceptions2.Forbidden).Description((_b = _options.forbiddenMessage) != null ? _b : "Forbidden"), (0, import_schema.Returns)(500, import_exceptions2.InternalServerError).Description("Internal Server Error"));
}
__name(UseAuth, "UseAuth");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AUTH_CONTEXT_PROVIDER_TYPE,
  AuthContextProvider,
  AuthMiddleware,
  USE_AUTH_DATA_KEY,
  UseAuth
});
