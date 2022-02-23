module.exports = {
    "settings": {
        "react": {
            "version": "detect"
        }
    },
    "env": {
        "browser": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:decorator-position/base"
    ],
    "ignorePatterns": ["node_modules/**/*.*", "Shared/Contracts.ts"],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "import",
        "prefer-arrow",
        "decorator-position"
    ],
    "rules": {
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/naming-convention": [
            "error",
            {
                "selector": "typeLike",
                "format": ["PascalCase"]
            },
            {
                "selector": "interface",
                "format": ["PascalCase"],
                "custom": {
                    "regex": "^I[A-Z]",
                    "match": false
                }
            }
        ],
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "decorator-position/decorator-position": [
            "error",
            {
                "properties": "above",
                "methods": "above"
            }
        ],
        "react/prop-types": "off",
        "func-style": ["error", "expression"],
        "@typescript-eslint/member-delimiter-style": [
            "error",
            {
                "multiline": {
                    "delimiter": "semi",
                    "requireLast": true
                },
                "singleline": {
                    "delimiter": "comma",
                    "requireLast": false
                }
            }
        ],
        "@typescript-eslint/quotes": [
            "error",
            "single"
        ],
        "@typescript-eslint/semi": [
            "error",
            "always"
        ],
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "curly": "error",
        "eqeqeq": [
            "error",
            "always"
        ],
        "indent": [
            "error",
            "tab",
            {
                "SwitchCase": 1
            }
        ],
        "import/no-default-export": "error",
        "import/order": ["error", {
            "groups": [
                ["external", "builtin"],
                ["internal", "index", "sibling", "parent"]
            ],
            "alphabetize": {
                "order": "asc", /* sort in ascending order. Options: ["ignore", "asc", "desc"] */
                "caseInsensitive": true /* ignore case. Options: [true, false] */
            }
        }],
        "sort-imports": ["error", {"ignoreDeclarationSort": true}],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "no-multiple-empty-lines": ["error", {"max": 1, "maxBOF": 1}],
        "no-bitwise": ["off"],
        "object-curly-spacing": ["error", "always"],
        "no-debugger": "error",
        "no-multiple-empty-lines": "error",
        "no-redeclare": "error",
        "no-trailing-spaces": "error",
        "no-unused-expressions": "error",
        "no-var": "error",
        "prefer-arrow/prefer-arrow-functions": [
            "error",
            {
                "disallowPrototype": true,
                "singleReturnOnly": false,
                "classPropertiesAllowed": true
            }
        ],
        "prefer-const": "error",
        "react/display-name": "off"
    }
};