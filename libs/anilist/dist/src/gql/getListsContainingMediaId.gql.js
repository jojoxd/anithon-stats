"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
var _apolloBoost = require("apollo-boost");
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
        "\n    query getListsContainingMediaId($mediaId: Int!, $userId: Int!) {\n        MediaList(mediaId:$mediaId, userId: $userId) {\n            customLists(asArray:true)\n        }\n    }\n"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
var _default = (0, _apolloBoost.gql)(_templateObject());

//# sourceMappingURL=getListsContainingMediaId.gql.js.map