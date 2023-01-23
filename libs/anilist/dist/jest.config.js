/* eslint-disable */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
var _default = {
    displayName: "anilist",
    preset: "../../jest.preset.js",
    testEnvironment: "node",
    transform: {
        "^.+\\.[tj]sx?$": [
            "@swc/jest",
            {
                jsc: {
                    transform: {
                        react: {
                            runtime: "automatic"
                        }
                    }
                }
            }
        ]
    },
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx"
    ],
    coverageDirectory: "../../coverage/libs/anilist"
};

//# sourceMappingURL=jest.config.js.map