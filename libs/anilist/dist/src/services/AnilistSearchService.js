"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AnilistSearchService", {
    enumerable: true,
    get: function() {
        return AnilistSearchService;
    }
});
var _di = require("@tsed/di");
var _common = require("@tsed/common");
var _anilistClientService = require("./AnilistClientService");
var _ = require("..");
var _searchUserByNameGql = _interopRequireDefault(require("../gql/searchUserByName.gql"));
var _searchSeriesGql = _interopRequireDefault(require("../gql/searchSeries.gql"));
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
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
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
var AnilistSearchService = /*#__PURE__*/ function() {
    "use strict";
    function AnilistSearchService() {
        _classCallCheck(this, AnilistSearchService);
    }
    var _proto = AnilistSearchService.prototype;
    _proto.searchUserByName = function searchUserByName(userName) {
        var _this = this;
        return _asyncToGenerator(function() {
            var user, _user_avatar_large;
            return __generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            _this.client.query({
                                query: _searchUserByNameGql.default,
                                variables: {
                                    name: userName
                                },
                                key: "searchUserByName",
                                ttl: _this.cacheConfig.ttl.searchUserByName,
                                convert: function(data) {
                                    return data.User;
                                }
                            })
                        ];
                    case 1:
                        user = _state.sent();
                        if (!user || !user.id) throw new _.AnilistNotAUserError('User "'.concat(userName, '" does not exist on AniList'));
                        return [
                            2,
                            {
                                id: user.id,
                                name: user.name,
                                avatar: {
                                    large: (_user_avatar_large = user.avatar.large) !== null && _user_avatar_large !== void 0 ? _user_avatar_large : user.avatar.medium
                                }
                            }
                        ];
                }
            });
        })();
    };
    _proto.searchSeriesByName = function searchSeriesByName(query, type) {
        var _this = this;
        return _asyncToGenerator(function() {
            return __generator(this, function(_state) {
                return [
                    2,
                    _this.client.query({
                        query: _searchSeriesGql.default,
                        variables: {
                            query: query,
                            type: type
                        },
                        key: "searchSeries",
                        ttl: _this.cacheConfig.ttl.searchSeries,
                        convert: function(data) {
                            return data.Page.media;
                        }
                    })
                ];
            });
        })();
    };
    _createClass(AnilistSearchService, [
        {
            key: "cacheConfig",
            get: // @TODO: Inject Cache Config (TTL)
            function get() {
                return {
                    ttl: {
                        searchUserByName: 600,
                        getUserById: 600,
                        fetchUserLists: 180,
                        getUserLists: 180,
                        currentUser: 3600,
                        findUsersByName: 3600,
                        searchSeries: 3600
                    }
                };
            }
        }
    ]);
    return AnilistSearchService;
} /*#__PURE__*/  /*#__PURE__*/ ();
__decorate([
    (0, _common.Inject)(),
    __metadata("design:type", typeof _anilistClientService.AnilistClientService === "undefined" ? Object : _anilistClientService.AnilistClientService)
], AnilistSearchService.prototype, "client", void 0);
AnilistSearchService = __decorate([
    (0, _di.Service)()
], AnilistSearchService);

//# sourceMappingURL=AnilistSearchService.js.map