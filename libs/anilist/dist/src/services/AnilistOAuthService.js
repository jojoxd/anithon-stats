"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AnilistOAuthService", {
    enumerable: true,
    get: function() {
        return AnilistOAuthService;
    }
});
var _common = require(/**
 * Helper for anilist OAuth
 */ "@tsed/common");
var _di = require("@tsed/di");
var _nodeFetch = _interopRequireDefault(require("node-fetch"));
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
var AnilistOAuthService = /*#__PURE__*/ function() {
    "use strict";
    function AnilistOAuthService() {
        _classCallCheck(this, AnilistOAuthService);
    }
    var _proto = AnilistOAuthService.prototype;
    _proto.getAuthorizeUri = function getAuthorizeUri(externalUri) {
        var sp = new URLSearchParams();
        sp.append("client_id", this.clientId);
        sp.append("redirect_uri", externalUri);
        sp.append("response_type", "code");
        return "https://anilist.co/api/v2/oauth/authorize?".concat(sp.toString());
    };
    _proto.getToken = function getToken(code, externalUri) {
        var _this = this;
        return _asyncToGenerator(function() {
            var response, jsonResponse;
            return __generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            (0, _nodeFetch.default)("https://anilist.co/api/v2/oauth/token", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Accept": "application/json"
                                },
                                body: JSON.stringify({
                                    grant_type: "authorization_code",
                                    client_id: _this.clientId,
                                    client_secret: _this.clientSecret,
                                    redirect_uri: externalUri,
                                    code: code
                                })
                            })
                        ];
                    case 1:
                        response = _state.sent();
                        _common["$log"].info("Anilist Token Response: ".concat(response.status));
                        return [
                            4,
                            response.json()
                        ];
                    case 2:
                        jsonResponse = _state.sent();
                        if (response.status > 200) {
                            _common["$log"].warn(jsonResponse);
                            return [
                                2,
                                null
                            ];
                        }
                        if (!jsonResponse.access_token) return [
                            2,
                            null
                        ];
                        return [
                            2,
                            jsonResponse.access_token
                        ];
                }
            });
        })();
    };
    return AnilistOAuthService;
} /*#__PURE__*/ ();
__decorate([
    (0, _di.Constant)("ANILIST_CLIENT_ID"),
    __metadata("design:type", String)
], AnilistOAuthService.prototype, "clientId", void 0);
__decorate([
    (0, _di.Constant)("ANILIST_CLIENT_SECRET"),
    __metadata("design:type", String)
], AnilistOAuthService.prototype, "clientSecret", void 0);

//# sourceMappingURL=AnilistOAuthService.js.map