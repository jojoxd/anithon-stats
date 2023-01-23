"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AnilistHelperService", {
    enumerable: true,
    get: function() {
        return AnilistHelperService;
    }
});
var _di = require("@tsed/di");
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var __decorate = (void 0) && (void 0).__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AnilistHelperService = /*#__PURE__*/ function() {
    function AnilistHelperService() {
        _classCallCheck(this, AnilistHelperService);
    }
    var _proto = AnilistHelperService.prototype;
    _proto.convertFuzzyDate = function convertFuzzyDate(fuzzyDate) {
        if (fuzzyDate === null) return null;
        if (fuzzyDate.year === null || fuzzyDate.month === null || fuzzyDate.day === null) return null;
        return new Date(fuzzyDate.year, fuzzyDate.month, fuzzyDate.day, 0, 0, 0, 0);
    };
    return AnilistHelperService;
}();
AnilistHelperService = __decorate([
    (0, _di.Service)()
], AnilistHelperService);

//# sourceMappingURL=AnilistHelperService.js.map