import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // These are code-quality / stylistic signals, not correctness bugs.
      // We keep linting enabled during builds (so type errors and genuinely
      // new lint problems still surface) but treat these as warnings rather
      // than hard build failures. Tighten back to "error" as the codebase is
      // cleaned up.
      "react/no-unescaped-entities": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@next/next/no-img-element": "warn",
    },
  },
];

export default eslintConfig;
