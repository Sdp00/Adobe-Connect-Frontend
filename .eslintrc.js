module.exports = {
  root: true,
  extends: 'airbnb-base',
  env: {
    browser: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  ignorePatterns: [
    'node_modules/**',
    'dist/**',
    'build/**',
    '*.min.js',
    'blocks/**',
    'scripts/vendor.js',
  ],
  rules: {
    'import/extensions': ['error', { js: 'always' }], // require js file extensions in imports
    'linebreak-style': 'off', // handled by .gitattributes for cross-platform compatibility
    'no-param-reassign': [2, { props: false }], // allow modifying properties of param
  },
};
