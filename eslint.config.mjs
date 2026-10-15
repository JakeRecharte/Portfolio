import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Turns off ESLint rules that conflict with Prettier. Must stay last.
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated demo payloads: Unity's WebGL loader is minified engine code
    // we neither wrote nor can fix, and linting it buries our own findings
    // under ~190 of its own. Prettier skips the same directory
    // (see .prettierignore).
    "public/demos/**",
  ]),
]);

export default eslintConfig;
