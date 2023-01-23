"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AnilistClientService", {
    enumerable: true,
    get: function() {
        return AnilistClientService;
    }
});
var _di = require(/*#__PURE__*/ "@tsed/di");
var _common = require("@tsed/common");
var _core = require("@tsed/core");
var _platformCache = require("@tsed/platform-cache");
var _apolloClientBuilder = require("../lib/ApolloClientBuilder");
var _anilist = require("@anistats/anilist");
var _crypto = require("crypto");
var _mutexManager = require("../lib/MutexManager");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var __decorate = (void 0) && (void 0).__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __generator = (void 0) && (void 0).__generator || function(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
};
var __metadata = (void 0) && (void 0).__metadata || function(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _AnilistClientService;
var AnilistClientService = (_AnilistClientService = /*#__PURE__*/ function() {
    "use strict";
    function AnilistClientService1() {
        var _this = this;
        _classCallCheck(this, AnilistClientService1);
        var builder = new _apolloClientBuilder.ApolloClientBuilder(AnilistClientService.ENDPOINT);
        builder.withAuth(function() {
            return _this.token;
        });
        this.apollo = builder.build();
    }
    var _proto = AnilistClientService1.prototype;
    _proto.createError = function createError(errors) {
        var errorMessage = errors.map(function(e) {
            return "GraphQLError/".concat(e.name, ": ").concat(e.message);
        }).join("\n");
        return new _anilist.AnilistError(errorMessage, errors);
    };
    _proto.hashObject = function hashObject(namespace, obj) {
        var hash = (0, _crypto.createHash)("md5").update(JSON.stringify(obj)).digest("hex");
        return "".concat(namespace, ":").concat(hash);
    };
    _proto.query = function query(settings) {
        var _this = this;
        return _asyncToGenerator(function() {
            var queryFn, _settings_variables, _settings_variables1, cacheKey, mut;
            return __generator(this, function(_state) {
                queryFn = function() {
                    var _ref = _asyncToGenerator(function() {
                        var _ref, data, errors, e;
                        return __generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    _state.trys.push([
                                        0,
                                        2,
                                        ,
                                        3
                                    ]);
                                    return [
                                        4,
                                        _this.apollo.query({
                                            query: settings.query,
                                            variables: settings.variables,
                                            fetchPolicy: "network-only",
                                            errorPolicy: "ignore"
                                        })
                                    ];
                                case 1:
                                    _ref = _state.sent(), data = _ref.data, errors = _ref.errors;
                                    if (errors) {
                                        _common["$log"].error(data);
                                        throw _this.createError(errors);
                                    }
                                    if (settings.convert) {
                                        return [
                                            2,
                                            settings.convert(data)
                                        ];
                                    }
                                    return [
                                        2,
                                        data
                                    ];
                                case 2:
                                    e = _state.sent();
                                    _common["$log"].error(e);
                                    throw e;
                                case 3:
                                    return [
                                        2
                                    ];
                            }
                        });
                    });
                    return function queryFn() {
                        return _ref.apply(this, arguments);
                    };
                }();
                if ((_settings_variables = settings.variables) !== null && _settings_variables !== void 0 ? _settings_variables : settings.hash) {
                    ;
                    cacheKey = _this.hashObject(settings.key, (_settings_variables1 = settings.variables) !== null && _settings_variables1 !== void 0 ? _settings_variables1 : settings.hash);
                    mut = _mutexManager.Mutexes.getMutex(cacheKey);
                    return [
                        2,
                        mut.runExclusive(/*#__PURE__*/ _asyncToGenerator(function() {
                            var _settings_ttl;
                            return __generator(this, function(_state) {
                                return [
                                    2,
                                    _this.cache.wrap(cacheKey, function() {
                                        return queryFn();
                                    }, (_settings_ttl = settings.ttl) !== null && _settings_ttl !== void 0 ? _settings_ttl : 30)
                                ];
                            });
                        }))
                    ];
                }
                return [
                    2,
                    queryFn()
                ];
            });
        })();
    };
    _proto.mutate = function mutate(settings) {
        var _this = this;
        return _asyncToGenerator(function() {
            var _ref, data, errors, e;
            return __generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            2,
                            ,
                            3
                        ]);
                        return [
                            4,
                            _this.apollo.mutate({
                                mutation: settings.mutation,
                                variables: settings.variables,
                                fetchPolicy: "no-cache",
                                errorPolicy: "ignore"
                            })
                        ];
                    case 1:
                        _ref = _state.sent(), data = _ref.data, errors = _ref.errors;
                        if (errors) {
                            throw _this.createError(errors);
                        }
                        if (settings.convert) {
                            return [
                                2,
                                settings.convert(data)
                            ];
                        }
                        return [
                            2,
                            data
                        ];
                    case 2:
                        e = _state.sent();
                        _common["$log"].error(e);
                        throw e;
                    case 3:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    _createClass(AnilistClientService1, [
        {
            key: "token",
            get: function get() {
                try {
                    var _this_$ctx, _this_$ctx_getRequest, _this_$ctx_getRequest_call, _this_$ctx_getRequest_call_session;
                    var _this_$ctx_getRequest_session_anilist_token;
                    return (_this_$ctx_getRequest_session_anilist_token = (_this_$ctx = this.$ctx) === null || _this_$ctx === void 0 ? void 0 : (_this_$ctx_getRequest = _this_$ctx.getRequest) === null || _this_$ctx_getRequest === void 0 ? void 0 : (_this_$ctx_getRequest_call = _this_$ctx_getRequest.call(_this_$ctx)) === null || _this_$ctx_getRequest_call === void 0 ? void 0 : (_this_$ctx_getRequest_call_session = _this_$ctx_getRequest_call.session) === null || _this_$ctx_getRequest_call_session === void 0 ? void 0 : _this_$ctx_getRequest_call_session.anilist_token) !== null && _this_$ctx_getRequest_session_anilist_token !== void 0 ? _this_$ctx_getRequest_session_anilist_token : null;
                } catch (e) {
                    _common["$log"].warn(e);
                    return null;
                }
            }
        }
    ]);
    return AnilistClientService1;
}(), _AnilistClientService.ENDPOINT = "https://graphql.anilist.co", _AnilistClientService);
__decorate([
    (0, _common.Constant)("env"),
    __metadata("design:type", typeof _core.Env === "undefined" ? Object : _core.Env)
], AnilistClientService.prototype, "env", void 0);
__decorate([
    (0, _di.InjectContext)(),
    __metadata("design:type", typeof _common.PlatformContext === "undefined" ? Object : _common.PlatformContext)
], AnilistClientService.prototype, "$ctx", void 0);
__decorate([
    (0, _common.Inject)(),
    __metadata("design:type", typeof _platformCache.PlatformCache === "undefined" ? Object : _platformCache.PlatformCache)
], AnilistClientService.prototype, "cache", void 0);
AnilistClientService = __decorate([
    (0, _di.Service)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [])
], AnilistClientService);

//# sourceMappingURL=AnilistClientService.js.map