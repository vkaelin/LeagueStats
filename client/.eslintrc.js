module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'plugin:vue/recommended',
    'eslint:recommended'
  ],
  rules: {
    //'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    "vue/html-self-closing": 'off',
    'vue/max-attributes-per-line': 'off',
    "vue/attributes-order": ["error", {
      "order": [
        "DEFINITION",
        "LIST_RENDERING",
        "CONDITIONALS",
        "RENDER_MODIFIERS",
        "UNIQUE",
        "TWO_WAY_BINDING",
        "OTHER_DIRECTIVES",
        "EVENTS",
        "CONTENT",
        "GLOBAL",
        "OTHER_ATTR"
      ]
    }],
    "quotes": [2, "single", { "avoidEscape": true }],
    "semi": [2, "never"]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
