module.exports = {
  root: true,
  extends: ["next/core-web-vitals"],
  env: {
    es6: true,
    node: true
  },
  ignorePatterns: ["node_modules", "build"],
  rules: {
    curly: 0,
    "import/no-anonymous-default-export": 0,
    "import/no-default-export": 0,
    "react-native/no-inline-styles": 0,
    "react-hooks/exhaustive-deps": 0,
    "react/self-closing-comp": [
      "error",
      {
        component: true,
        html: true
      }
    ],
    "react/jsx-filename-extension": [
      1,
      {
        extensions: [".js", ".jsx"]
      }
    ],
    "react/no-unescaped-entities": [
      "error",
      {
        forbid: [">", "}"]
      }
    ],
    "unused-imports/no-unused-imports": "error",
    quotes: [
      "error",
      "double",
      {
        avoidEscape: true,
        allowTemplateLiterals: false
      }
    ],
    "jsx-quotes": ["error", "prefer-double"],
    semi: ["error", "always"],
    "comma-dangle": ["error", "never"],
    "prettier/prettier": [
      "error",
      {
        trailingComma: "none",
        singleQuote: false,
        jsxSingleQuote: false,
        printWidth: 180,
        semi: true,
        arrowParens: "avoid",
        jsxBracketSameLine: true
      }
    ]
  },
  plugins: ["prettier", "react", "jsx-a11y", "eslint-plugin-prettier", "eslint-plugin-react", "eslint-plugin-react-hooks", "unused-imports"]
};
