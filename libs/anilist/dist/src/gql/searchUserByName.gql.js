"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default" /*#__PURE__*/ , {
    enumerable: true,
    get: function() {
        return _default;
    }
});
var _apolloBoost = require("apollo-boost");
var _userDataFragmentGql = _interopRequireDefault(require("./fragments/UserDataFragment.gql"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _taggedTemplateLiteral(strings, raw) {
    if (!raw) {
        raw = strings.slice(0);
    }
    return Object.freeze(Object.defineProperties(strings, {
        raw: {
            value: Object.freeze(raw)
        }
    }));
}
function _templateObject() {
    var data = _taggedTemplateLiteral([
        "\n    query searchUserByName($name: String!) {\n        User(name: $name) {\n			...UserData\n        }\n    }\n\n	",
        "\n"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
var _default = (0, _apolloBoost.gql)(_templateObject(), _userDataFragmentGql.default);

//# sourceMappingURL=searchUserByName.gql.js.map