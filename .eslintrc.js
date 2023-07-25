module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'airbnb-base'
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    "no-console": "off",
    'no-undef': 'off',
    'no-param-reassign': 'off',
    'no-unused-expressions': 'off',
    "class-methods-use-this": "off",
    'import/no-unresolved': 'off',
    'import/extensions': ['error', 'ignorePackages', {
      ts: 'never',
      tsx: 'never',
      js: 'never',
      jsx: 'never',
      mjs: 'never',
      json: 'never',
      '': 'never',
    }],
  },
};
