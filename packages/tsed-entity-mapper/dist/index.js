var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.ts
var tsed_entity_mapper_exports = {};
__export(tsed_entity_mapper_exports, {
  BodyParamEntity: () => BodyParamEntity,
  DeserializerPipe: () => DeserializerPipe,
  ENTITY_MAPPER_REFLECT_DATA_KEY: () => ENTITY_MAPPER_REFLECT_DATA_KEY,
  ENTITY_MAPPER_TYPE: () => ENTITY_MAPPER_TYPE,
  EntityMapper: () => EntityMapper,
  EntityMapperPipe: () => EntityMapperPipe,
  PathParamEntity: () => PathParamEntity,
  QueryParamEntity: () => QueryParamEntity,
  ValidationPipe: () => ValidationPipe
});
module.exports = __toCommonJS(tsed_entity_mapper_exports);

// src/decorators/mapper/EntityMapper.ts
var import_core = require("@tsed/core");
var import_di = require("@tsed/di");
var ENTITY_MAPPER_TYPE = "tsed-entity-mapper:entity-mapper";
var ENTITY_MAPPER_REFLECT_DATA_KEY = ENTITY_MAPPER_TYPE + ":metadata";
function EntityMapper(entity, options) {
  options != null ? options : options = {};
  options.type = ENTITY_MAPPER_TYPE;
  return (0, import_core.useDecorators)((0, import_di.Injectable)(options), (target) => {
    import_core.Store.from(target).merge(ENTITY_MAPPER_REFLECT_DATA_KEY, {
      targetType: entity
    });
  });
}
__name(EntityMapper, "EntityMapper");

// src/decorators/params/BodyParamEntity.ts
var import_core3 = require("@tsed/core");
var import_platform_params = require("@tsed/platform-params");

// src/pipes/EntityMapperPipe.ts
var import_di2 = require("@tsed/di");
var import_core2 = require("@tsed/core");
var import_common = require("@tsed/common");
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
var EntityMapperPipe = /* @__PURE__ */ __name(class EntityMapperPipe2 {
  get entityMappers() {
    return this.injector.getMany(ENTITY_MAPPER_TYPE);
  }
  async transform(value, metadata) {
    const paramOptions = metadata.store.get(EntityMapperPipe2);
    const entityMapper1 = this.entityMappers.find((entityMapper) => {
      const entityMapperMetadata = import_core2.Store.from(entityMapper).get(ENTITY_MAPPER_REFLECT_DATA_KEY);
      return (entityMapperMetadata == null ? void 0 : entityMapperMetadata.targetType) === metadata.type;
    });
    const context = {
      options: paramOptions.options,
      ctx: this.$ctx
    };
    return entityMapper1 == null ? void 0 : entityMapper1.map(value, context);
  }
}, "EntityMapperPipe");
__decorate([
  (0, import_di2.Inject)(),
  __metadata("design:type", typeof import_di2.InjectorService === "undefined" ? Object : import_di2.InjectorService)
], EntityMapperPipe.prototype, "injector", void 0);
__decorate([
  (0, import_di2.InjectContext)(),
  __metadata("design:type", typeof import_common.PlatformContext === "undefined" ? Object : import_common.PlatformContext)
], EntityMapperPipe.prototype, "$ctx", void 0);
EntityMapperPipe = __decorate([
  (0, import_di2.Injectable)({
    scope: import_di2.ProviderScope.REQUEST
  })
], EntityMapperPipe);

// src/decorators/params/BodyParamEntity.ts
function BodyParamEntity(expression, options) {
  let paramDecorator = (0, import_platform_params.BodyParams)();
  if (typeof expression !== "undefined") {
    paramDecorator = (0, import_platform_params.BodyParams)(expression);
  }
  return (0, import_core3.useDecorators)(paramDecorator, (0, import_platform_params.UsePipe)(EntityMapperPipe, options));
}
__name(BodyParamEntity, "BodyParamEntity");

// src/decorators/params/PathParamEntity.ts
var import_core4 = require("@tsed/core");
var import_platform_params2 = require("@tsed/platform-params");
function PathParamEntity(expression, options) {
  return (0, import_core4.useDecorators)((0, import_platform_params2.RawPathParams)(expression), (0, import_platform_params2.UsePipe)(EntityMapperPipe, options));
}
__name(PathParamEntity, "PathParamEntity");

// src/decorators/params/QueryParamEntity.ts
var import_core5 = require("@tsed/core");
var import_platform_params3 = require("@tsed/platform-params");
function QueryParamEntity(expression, options) {
  return (0, import_core5.useDecorators)((0, import_platform_params3.RawQueryParams)(expression), (0, import_platform_params3.UsePipe)(EntityMapperPipe, options));
}
__name(QueryParamEntity, "QueryParamEntity");

// src/pipes/ValidationPipe.ts
var import_platform_params4 = require("@tsed/platform-params");
var import_di3 = require("@tsed/di");
var __decorate2 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ValidationPipe = /* @__PURE__ */ __name(class ValidationPipe2 extends import_platform_params4.ValidationPipe {
  async transform(value, metadata) {
    const entityMapperPipe = metadata.pipes.find((pipe) => pipe === EntityMapperPipe);
    if (entityMapperPipe) {
      return value;
    }
    return super.transform(value, metadata);
  }
}, "ValidationPipe");
ValidationPipe = __decorate2([
  (0, import_di3.OverrideProvider)(import_platform_params4.ValidationPipe)
], ValidationPipe);

// src/pipes/DeserializerPipe.ts
var import_platform_params5 = require("@tsed/platform-params");
var import_di4 = require("@tsed/di");
var __decorate3 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DeserializerPipe = /* @__PURE__ */ __name(class DeserializerPipe2 extends import_platform_params5.DeserializerPipe {
  async transform(value, metadata) {
    const entityMapperPipe = metadata.pipes.find((pipe) => pipe === EntityMapperPipe);
    if (entityMapperPipe) {
      return value;
    }
    return super.transform(value, metadata);
  }
}, "DeserializerPipe");
DeserializerPipe = __decorate3([
  (0, import_di4.OverrideProvider)(import_platform_params5.DeserializerPipe)
], DeserializerPipe);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BodyParamEntity,
  DeserializerPipe,
  ENTITY_MAPPER_REFLECT_DATA_KEY,
  ENTITY_MAPPER_TYPE,
  EntityMapper,
  EntityMapperPipe,
  PathParamEntity,
  QueryParamEntity,
  ValidationPipe
});
