"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AnilistService", {
    enumerable: true,
    get: function() {
        return AnilistService;
    }
});
var _common = require("@tsed/common");
var _core = require("@tsed/core");
var _anilistNotAUserError = require("../AnilistNotAUserError");
var _getUserByIdGql = _interopRequireDefault(require("../gql/getUserById.gql"));
var _getCurrentUserGql = _interopRequireDefault(require("../gql/getCurrentUser.gql"));
var _getUserListsGql = _interopRequireDefault(require("../gql/getUserLists.gql"));
var _fetchUserListsGql = _interopRequireDefault(require("../gql/fetchUserLists.gql"));
var _findUsersByNameGql = _interopRequireDefault(require("../gql/findUsersByName.gql"));
var _types = require("../generated/types");
var _anilistClientService = require("./AnilistClientService");
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
var AnilistService = /*#__PURE__*/ function() {
    "use strict";
    function AnilistService() {
        _classCallCheck(this, AnilistService);
    }
    var _proto = AnilistService.prototype;
    _proto.fetchUserLists = function fetchUserLists(userId, type, statuses) {
        var _this = this;
        return _asyncToGenerator(function() {
            return __generator(this, function(_state) {
                _common["$log"].info("AnilistService.fetchUserLists(".concat(userId, ", ").concat(type, ", [").concat(statuses, "])"));
                // Normalize Statuses
                if (typeof statuses === "undefined") statuses = Object.values(_types.MediaListStatus);
                if (!Array.isArray(statuses)) statuses = [
                    statuses
                ];
                return [
                    2,
                    _this.client.query({
                        query: _fetchUserListsGql.default,
                        variables: {
                            userId: userId,
                            type: type,
                            statuses: statuses
                        },
                        key: "fetchUserLists",
                        ttl: _this.cacheConfig.ttl.fetchUserLists,
                        // @hack: using a convert function to log some data is not very semantic
                        convert: function(data) {
                            if (_this.env === _core.Env.DEV) {
                                var len = new TextEncoder().encode(JSON.stringify(data)).byteLength;
                                _common["$log"].info("We just nuked anilist to get ~".concat((len / 1024 / 1024).toFixed(1), "MB of data"));
                            }
                            return data;
                        }
                    })
                ];
            });
        })();
    };
    _proto.getUserLists = function getUserLists(userId, type, statuses) {
        var _this = this;
        return _asyncToGenerator(function() {
            return __generator(this, function(_state) {
                _common["$log"].info("AnilistService.getUserLists(".concat(userId, ", ").concat(type, ", ").concat(statuses, ")"));
                // Normalize Statuses
                if (typeof statuses === "undefined") statuses = Object.values(_types.MediaListStatus);
                if (!Array.isArray(statuses)) statuses = [
                    statuses
                ];
                return [
                    2,
                    _this.client.query({
                        query: _getUserListsGql.default,
                        variables: {
                            userId: userId,
                            type: type,
                            statuses: statuses
                        },
                        key: "getUserLists",
                        ttl: _this.cacheConfig.ttl.getUserLists
                    })
                ];
            });
        })();
    };
    _proto.getUserList = function getUserList(userId, type, name) {
        var _this = this;
        return _asyncToGenerator(function() {
            var _lists_MediaListCollection, _lists_MediaListCollection_lists, lists;
            return __generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _common["$log"].info("AnilistService.getUserList()");
                        return [
                            4,
                            _this.fetchUserLists(userId, type)
                        ];
                    case 1:
                        lists = _state.sent();
                        return [
                            2,
                            (_lists_MediaListCollection = lists.MediaListCollection) === null || _lists_MediaListCollection === void 0 ? void 0 : (_lists_MediaListCollection_lists = _lists_MediaListCollection.lists) === null || _lists_MediaListCollection_lists === void 0 ? void 0 : _lists_MediaListCollection_lists.find(function(list) {
                                return (list === null || list === void 0 ? void 0 : list.name) === name;
                            })
                        ];
                }
            });
        })();
    };
    _proto.getCurrentUser = function getCurrentUser() {
        var _this = this;
        return _asyncToGenerator(function() {
            var // @TODO: Fix typing
            viewer;
            return __generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (!_this.client.token) return [
                            2,
                            null
                        ];
                        _common["$log"].info("AnilistService.getCurrentUser()");
                        return [
                            4,
                            _this.client.query({
                                query: _getCurrentUserGql.default,
                                key: "currentUser",
                                hash: _this.client.token,
                                ttl: _this.cacheConfig.ttl.currentUser,
                                convert: function(data) {
                                    return data.Viewer;
                                }
                            })
                        ];
                    case 1:
                        viewer = _state.sent();
                        return [
                            2,
                            {
                                id: viewer.id,
                                name: viewer.name,
                                avatar: {
                                    large: viewer.avatar.large
                                }
                            }
                        ];
                }
            });
        })();
    };
    _proto.getUserById = function getUserById(userId) {
        var _this = this;
        return _asyncToGenerator(function() {
            var user, _user_avatar_large;
            return __generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _common["$log"].info("Fetching user by userId", {
                            userId: userId
                        });
                        return [
                            4,
                            _this.client.query({
                                query: _getUserByIdGql.default,
                                variables: {
                                    userId: userId
                                },
                                key: "getUserById",
                                ttl: _this.cacheConfig.ttl.getUserById,
                                convert: function(data) {
                                    return data.User;
                                }
                            })
                        ];
                    case 1:
                        user = _state.sent();
                        if (!user || !user.id) throw new _anilistNotAUserError.AnilistNotAUserError('User "'.concat(userId, '" does not exist on AniList'));
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
    _proto.findUsersByName = function findUsersByName(username) {
        var _this = this;
        return _asyncToGenerator(function() {
            var users;
            return __generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            _this.client.query({
                                query: _findUsersByNameGql.default,
                                variables: {
                                    query: username,
                                    page: 0,
                                    perPage: 10
                                },
                                key: "findUsersByName",
                                ttl: _this.cacheConfig.ttl.findUsersByName,
                                convert: function(data) {
                                    return data.Page.users;
                                }
                            })
                        ];
                    case 1:
                        users = _state.sent();
                        return [
                            2,
                            users.map(function(gqlUser) {
                                var _gqlUser_avatar_large;
                                return {
                                    id: gqlUser.id,
                                    name: gqlUser.name,
                                    avatar: {
                                        large: (_gqlUser_avatar_large = gqlUser.avatar.large) !== null && _gqlUser_avatar_large !== void 0 ? _gqlUser_avatar_large : gqlUser.avatar.medium
                                    }
                                };
                            })
                        ];
                }
            });
        })();
    };
    _createClass(AnilistService, [
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
                        findUsersByName: 3600
                    }
                };
            }
        }
    ]);
    return AnilistService;
} /*#__PURE__*/  /*#__PURE__*/  /*#__PURE__*/  /*#__PURE__*/  /*#__PURE__*/ ();
__decorate([
    (0, _common.Inject)(),
    __metadata("design:type", typeof _anilistClientService.AnilistClientService === "undefined" ? Object : _anilistClientService.AnilistClientService)
], AnilistService.prototype, "client", void 0);
__decorate([
    (0, _common.Constant)("env"),
    __metadata("design:type", typeof _core.Env === "undefined" ? Object : _core.Env)
], AnilistService.prototype, "env", void 0);
AnilistService = __decorate([
    (0, _common.Service)(),
    (0, _common.Scope)(_common.ProviderScope.REQUEST),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [])
], AnilistService);

//# sourceMappingURL=AnilistService.js.map