"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default" /*#__PURE__*/  /*#__PURE__*/ , {
    enumerable: true,
    get: function() {
        return _default;
    }
});
var _graphqlTag = _interopRequireDefault(require("graphql-tag"));
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
        "\n	query findUsersByName($query: String!, $page: Int!, $perPage: Int!) {\n		Page(page: $page, perPage: $perPage) {\n			users(search: $query) {\n				...UserData\n			}\n		}\n	}\n	\n	",
        "\n"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
var _default = (0, _graphqlTag.default)(_templateObject(), _userDataFragmentGql.default);

//# sourceMappingURL=findUsersByName.gql.js.map