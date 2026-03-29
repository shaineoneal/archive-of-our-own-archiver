import js from "@eslint/js";
import globals from "globals";
import tsPlugin from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        plugins: { js },
        extends: [
            "js/recommended",
            "tsPlugin/recommended",
            "reactPlugin/flat/recommended"
        ],
        languageOptions: {
            globals: globals.browser
        },
        rules: {
            "react/jsx-uses-react": "off",
            "react/react-in-jsx-scope": "off"
        }
    },

    tsPlugin.configs.recommended,
    reactPlugin.configs.flat.recommended,
]);
