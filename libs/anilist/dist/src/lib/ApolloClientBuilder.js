"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApolloClientBuilder", {
    enumerable: true,
    get: function() {
        return ApolloClientBuilder;
    }
});
var _apolloBoost = require("apollo-boost");
var _nodeFetch = _interopRequireDefault(require("node-fetch"));
var _common = require("@tsed/common");
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
var ApolloClientBuilder = /*#__PURE__*/ function() {
    function ApolloClientBuilder(uri, cache) {
        _classCallCheck(this, ApolloClientBuilder);
        this.cache = null;
        this.link = null;
        this.authLink = null;
        if (typeof uri !== "undefined") this.withUri(uri);
        if (typeof cache !== "undefined") this.withCache(cache);
    }
    var _proto = ApolloClientBuilder.prototype;
    _proto.withCache = function withCache(cache) {
        this.cache = cache;
        return this;
    };
    _proto.withMemoryCache = function withMemoryCache() {
        this.withCache(new _apolloBoost.InMemoryCache());
        return this;
    };
    _proto.withUri = function withUri(uri) {
        this.link = new _apolloBoost.HttpLink({
            uri: uri,
            // @ts-ignore TS-2322 Different implementations, but are compatible
            fetch: _nodeFetch.default
        });
        return this;
    };
    _proto.withAuth = function withAuth(getBearer) {
        this.authLink = new _apolloBoost.ApolloLink(function(operation, forward) {
            var bearerToken = getBearer();
            if (bearerToken !== null) {
                operation.setContext({
                    headers: {
                        Authorization: "Bearer ".concat(getBearer())
                    }
                });
            }
            return forward(operation);
        });
    };
    _proto.build = function build() {
        if (this.link === null) throw new Error("No Link Specified");
        if (this.cache === null) this.withMemoryCache();
        var link = this.interceptorLink.concat(this.link);
        if (this.authLink) {
            link = this.authLink.concat(this.link);
        }
        return new _apolloBoost.ApolloClient({
            cache: this.cache,
            link: link
        });
    };
    _createClass(ApolloClientBuilder, [
        {
            key: "interceptorLink",
            get: function get() {
                return new _apolloBoost.ApolloLink(function(operation, forward) {
                    // Before
                    _common["$log"].info('GQL REQUEST "'.concat(operation.operationName, '"'));
                    var response = forward(operation);
                    // After
                    _common["$log"].info('GQL REQUEST COMPLETE "'.concat(operation.operationName, '"'));
                    return response;
                });
            }
        }
    ]);
    return ApolloClientBuilder;
} /*#__PURE__*/ ();

//# sourceMappingURL=ApolloClientBuilder.js.map