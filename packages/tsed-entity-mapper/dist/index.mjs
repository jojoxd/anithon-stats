var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/decorators/mapper/EntityMapper.ts
import { useDecorators, Store } from "@tsed/core";
import { Injectable } from "@tsed/di";
var ENTITY_MAPPER_TYPE = "tsed-entity-mapper:entity-mapper";
var ENTITY_MAPPER_REFLECT_DATA_KEY = ENTITY_MAPPER_TYPE + ":metadata";
function EntityMapper(entity, options) {
  options != null ? options : options = {};
  options.type = ENTITY_MAPPER_TYPE;
  return useDecorators(Injectable(options), (target) => {
    Store.from(target).merge(ENTITY_MAPPER_REFLECT_DATA_KEY, {
      targetType: entity
    });
  });
}
__name(EntityMapper, "EntityMapper");

// src/decorators/params/BodyParamEntity.ts
import { useDecorators as useDecorators2 } from "@tsed/core";
import { BodyParams, UsePipe } from "@tsed/platform-params";

// src/pipes/EntityMapperPipe.ts
import { Inject, Injectable as Injectable2, InjectContext, InjectorService, ProviderScope } from "@tsed/di";
import { Store as Store2 } from "@tsed/core";
import { PlatformContext } from "@tsed/common";
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
    return this.injector.getAll(ENTITY_MAPPER_TYPE);
  }
  async transform(value, metadata) {
    const paramOptions = metadata.store.get(EntityMapperPipe2);
    const entityMapper1 = this.entityMappers.find((entityMapper) => {
      const entityMapperMetadata = Store2.from(entityMapper).get(ENTITY_MAPPER_REFLECT_DATA_KEY);
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
  Inject(),
  __metadata("design:type", typeof InjectorService === "undefined" ? Object : InjectorService)
], EntityMapperPipe.prototype, "injector", void 0);
__decorate([
  InjectContext(),
  __metadata("design:type", typeof PlatformContext === "undefined" ? Object : PlatformContext)
], EntityMapperPipe.prototype, "$ctx", void 0);
EntityMapperPipe = __decorate([
  Injectable2({
    scope: ProviderScope.REQUEST
  })
], EntityMapperPipe);

// src/decorators/params/BodyParamEntity.ts
function BodyParamEntity(expression, options) {
  let paramDecorator = BodyParams();
  if (typeof expression !== "undefined") {
    paramDecorator = BodyParams(expression);
  }
  return useDecorators2(paramDecorator, UsePipe(EntityMapperPipe, options));
}
__name(BodyParamEntity, "BodyParamEntity");

// src/decorators/params/PathParamEntity.ts
import { useDecorators as useDecorators3 } from "@tsed/core";
import { RawPathParams, UsePipe as UsePipe2 } from "@tsed/platform-params";
function PathParamEntity(expression, options) {
  return useDecorators3(RawPathParams(expression), UsePipe2(EntityMapperPipe, options));
}
__name(PathParamEntity, "PathParamEntity");

// src/decorators/params/QueryParamEntity.ts
import { useDecorators as useDecorators4 } from "@tsed/core";
import { RawQueryParams, UsePipe as UsePipe3 } from "@tsed/platform-params";
function QueryParamEntity(expression, options) {
  return useDecorators4(RawQueryParams(expression), UsePipe3(EntityMapperPipe, options));
}
__name(QueryParamEntity, "QueryParamEntity");

// src/pipes/ValidationPipe.ts
import { ValidationPipe as BaseValidationPipe } from "@tsed/platform-params";
import { OverrideProvider } from "@tsed/di";
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
var ValidationPipe = /* @__PURE__ */ __name(class ValidationPipe2 extends BaseValidationPipe {
  async transform(value, metadata) {
    const entityMapperPipe = metadata.pipes.find((pipe) => pipe === EntityMapperPipe);
    if (entityMapperPipe) {
      console.log("VP val ->", value);
      return value;
    }
    return super.transform(value, metadata);
  }
}, "ValidationPipe");
ValidationPipe = __decorate2([
  OverrideProvider(BaseValidationPipe)
], ValidationPipe);

// src/pipes/DeserializerPipe.ts
import { DeserializerPipe as BaseDeserializerPipe } from "@tsed/platform-params";
import { OverrideProvider as OverrideProvider2 } from "@tsed/di";
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
var DeserializerPipe = /* @__PURE__ */ __name(class DeserializerPipe2 extends BaseDeserializerPipe {
  async transform(value, metadata) {
    const entityMapperPipe = metadata.pipes.find((pipe) => pipe === EntityMapperPipe);
    if (entityMapperPipe) {
      console.log("DP val ->", value);
      return value;
    }
    return super.transform(value, metadata);
  }
}, "DeserializerPipe");
DeserializerPipe = __decorate3([
  OverrideProvider2(BaseDeserializerPipe)
], DeserializerPipe);
export {
  BodyParamEntity,
  DeserializerPipe,
  ENTITY_MAPPER_REFLECT_DATA_KEY,
  ENTITY_MAPPER_TYPE,
  EntityMapper,
  EntityMapperPipe,
  PathParamEntity,
  QueryParamEntity,
  ValidationPipe
};
