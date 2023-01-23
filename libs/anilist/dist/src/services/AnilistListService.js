"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AnilistListService", {
    enumerable: true,
    get: function() {
        return AnilistListService;
    }
});
var _di = require("@tsed/di");
var _anilistClientService = require("./AnilistClientService");
var _addEntryToListGql = _interopRequireDefault(require("../gql/mutation/addEntryToList.gql"));
var _ = require("..");
var _getListsContainingMediaIdGql = _interopRequireDefault(require("../gql/getListsContainingMediaId.gql"));
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
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
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
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
var AnilistListService = /*#__PURE__*/ function() {
    "use strict";
    function AnilistListService() {
        _classCallCheck(this, AnilistListService);
    }
    var _proto = AnilistListService.prototype;
    _proto.addEntry = function addEntry(listName, mediaId) {
        var _this = this;
        return _asyncToGenerator(function() {
            var currentUser, originalListNames, _val_SaveMediaListEntry_id;
            return __generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            _this.baseService.getCurrentUser()
                        ];
                    case 1:
                        currentUser = _state.sent();
                        if (!currentUser) {
                            throw new Error("Can't add list to user as we are not authenticated");
                        }
                        return [
                            4,
                            _this.getListsContainingMediaId(currentUser.id, mediaId)
                        ];
                    case 2:
                        originalListNames = _state.sent();
                        // Add Entry to lists
                        return [
                            2,
                            _this.client.mutate({
                                mutation: _addEntryToListGql.default,
                                variables: {
                                    listNames: _toConsumableArray(originalListNames).concat([
                                        listName
                                    ]),
                                    mediaId: mediaId
                                },
                                convert: function(val) {
                                    var _val_SaveMediaListEntry;
                                    return (_val_SaveMediaListEntry_id = val === null || val === void 0 ? void 0 : (_val_SaveMediaListEntry = val.SaveMediaListEntry) === null || _val_SaveMediaListEntry === void 0 ? void 0 : _val_SaveMediaListEntry.id) !== null && _val_SaveMediaListEntry_id !== void 0 ? _val_SaveMediaListEntry_id : null;
                                }
                            })
                        ];
                }
            });
        })();
    };
    _proto.removeEntry = function removeEntry(listName, mediaId) {
        var _this = this;
        return _asyncToGenerator(function() {
            var currentUser, originalListNames;
            return __generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            _this.baseService.getCurrentUser()
                        ];
                    case 1:
                        currentUser = _state.sent();
                        if (!currentUser) {
                            console.log("NO CURRENT USER");
                            throw new Error("Can't remove list entry from user as we are not authenticated");
                        }
                        return [
                            4,
                            _this.getListsContainingMediaId(currentUser.id, mediaId)
                        ];
                    case 2:
                        originalListNames = _state.sent();
                        // Add Entry to lists
                        return [
                            4,
                            _this.client.mutate({
                                mutation: _addEntryToListGql.default,
                                variables: {
                                    listNames: originalListNames.filter(function(originalListName) {
                                        return originalListName !== listName;
                                    }),
                                    mediaId: mediaId
                                }
                            })
                        ];
                    case 3:
                        _state.sent();
                        return [
                            2
                        ];
                }
            });
        })();
    };
    _proto.getListsContainingMediaId = function getListsContainingMediaId(userId, mediaId) {
        var _this = this;
        return _asyncToGenerator(function() {
            var lists;
            return __generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            _this.client.query({
                                query: _getListsContainingMediaIdGql.default,
                                variables: {
                                    userId: userId,
                                    mediaId: mediaId
                                },
                                key: "getListsContainingMediaId",
                                convert: function(val) {
                                    var _val_MediaList_customLists_filter, _val_MediaList_customLists;
                                    return (_val_MediaList_customLists_filter = (_val_MediaList_customLists = val.MediaList.customLists) === null || _val_MediaList_customLists === void 0 ? void 0 : _val_MediaList_customLists.filter(function(list) {
                                        return list.enabled;
                                    })) === null || _val_MediaList_customLists_filter === void 0 ? void 0 : _val_MediaList_customLists_filter.map(function(list) {
                                        return list.name;
                                    });
                                }
                            })
                        ];
                    case 1:
                        lists = _state.sent();
                        if (!lists) {
                            throw new Error("Failed to fetch lists containing ".concat(mediaId, " on user ").concat(userId));
                        }
                        return [
                            2,
                            lists
                        ];
                }
            });
        })();
    };
    return AnilistListService;
} /*#__PURE__*/  /*#__PURE__*/ ();
__decorate([
    (0, _di.Inject)(),
    __metadata("design:type", typeof _anilistClientService.AnilistClientService === "undefined" ? Object : _anilistClientService.AnilistClientService)
], AnilistListService.prototype, "client", void 0);
__decorate([
    (0, _di.Inject)(),
    __metadata("design:type", typeof _.AnilistService === "undefined" ? Object : _.AnilistService)
], AnilistListService.prototype, "baseService", void 0);
AnilistListService = __decorate([
    (0, _di.Service)()
], AnilistListService);

//# sourceMappingURL=AnilistListService.js.map