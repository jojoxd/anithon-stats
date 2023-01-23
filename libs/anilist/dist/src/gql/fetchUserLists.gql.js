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
var _seriesDataFragmentGql = _interopRequireDefault(require("./fragments/SeriesDataFragment.gql"));
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
        "\n    query fetchUserLists($userId: Int!, $type: MediaType!, $statuses: [MediaListStatus!]!) {\n        MediaListCollection(userId: $userId, type: $type, status_in:$statuses) {\n            user {\n                id\n            }\n\n            lists {\n                name\n                entries {\n                    id\n                    status\n                    notes\n                    progress\n\n                    startedAt {\n                        year\n                        month\n                        day\n                    }\n\n                    completedAt {\n                        year\n                        month\n                        day\n                    }\n\n                    media {\n                        ...SeriesData\n                    }\n                }\n            }\n        }\n    }\n    \n    ",
        "\n"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
var _default = (0, _apolloBoost.gql)(_templateObject(), _seriesDataFragmentGql.default);

//# sourceMappingURL=fetchUserLists.gql.js.map