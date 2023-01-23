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
var _graphqlTag = _interopRequireDefault(require("graphql-tag"));
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
        "\n    fragment SeriesData on Media {\n        id\n        status\n        format\n        episodes\n        duration\n        description\n\n        coverImage {\n            large\n        }\n\n        startDate {\n            year\n            month\n            day\n        }\n\n        endDate {\n            year\n            month\n            day\n        }\n\n        title {\n            romaji\n            english\n            native\n        }\n\n        relations {\n            edges {\n                relationType\n                node {\n                    id\n                    title {\n                        romaji\n                        english\n                        native\n                    }\n                }\n            }\n        }\n    }\n"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
var _default = (0, _graphqlTag.default)(_templateObject());

//# sourceMappingURL=SeriesDataFragment.gql.js.map