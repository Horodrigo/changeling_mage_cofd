import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import noUntranslatedUiText from "./eslint-rules/no-untranslated-ui-text.mjs";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".sites-package-*/**",
    ".sites-runtime/**",
    "dist/**",
    "out/**",
    "build/**",
    "tmp/**",
    "next-env.d.ts",
    "**/dist/**",
    "**/.next/**",
    "**/build/**",
  ]),
  {
    files: ["app/**/*.{ts,tsx}", "game-lines/**/*.{ts,tsx}"],
    plugins: {
      i18n: {
        rules: { "no-untranslated-ui-text": noUntranslatedUiText },
      },
    },
    rules: {
      "i18n/no-untranslated-ui-text": "warn",
    },
  },
  {
    files: ["components/ui/**/*.{ts,tsx}", "hooks/use-mobile.ts"],
    rules: {
      // These files are vendored verbatim from shadcn@4.17.0. Keep the
      // registry source intact while applying the stricter rules to Site code.
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/purity": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
