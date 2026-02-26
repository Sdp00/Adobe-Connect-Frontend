import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginImport from "eslint-plugin-import";
import pluginReact from "eslint-plugin-react";
import { builtinRules } from "eslint/use-at-your-own-risk";

const tsFiles = ["**/*.{ts,tsx,mts,cts}"];
const tsConfigs = tseslint.configs.recommended.map((config) => ({
  ...config,
  files: tsFiles,
}));
const supportedRules = new Set([...builtinRules.keys()]);
const jsRecommendedRules = Object.fromEntries(
  Object.entries(js.configs.recommended.rules).filter(([ruleName]) =>
    supportedRules.has(ruleName),
  ),
);

export default [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "__MACOSX/**",
      "scripts/vendor.js",
      "blocks/banner/banner.js",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}"],
    rules: jsRecommendedRules,
  },
  ...tsConfigs,
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}"],
    plugins: {
      import: pluginImport,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
    },
  },
  {
    files: ["**/*.{cjs,cts}"],
    languageOptions: {
      sourceType: "commonjs",
    },
  },
];
