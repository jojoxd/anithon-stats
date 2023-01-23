"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    MutexManager: function() {
        return MutexManager;
    },
    Mutexes: function() {
        return Mutexes;
    }
});
var _asyncMutex = require("async-mutex");
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var _this_mutexes, _key;
var MutexManager = /*#__PURE__*/ function() {
    "use strict";
    function MutexManager() {
        _classCallCheck(this, MutexManager);
        this.mutexes = {};
    }
    var _proto = MutexManager.prototype;
    _proto.getMutex = function getMutex(key) {
        var _;
        (_ = (_this_mutexes = this.mutexes)[_key = key]) !== null && _ !== void 0 ? _ : _this_mutexes[_key] = new _asyncMutex.Mutex();
        return this.mutexes[key];
    };
    return MutexManager;
}();
var Mutexes = new MutexManager();

//# sourceMappingURL=MutexManager.js.map