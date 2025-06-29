import { FlatCompat } from '@eslint/eslintrc';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import promisePlugin from 'eslint-plugin-promise';
import sonarjsPlugin from 'eslint-plugin-sonarjs';
import unicornPlugin from 'eslint-plugin-unicorn';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import { dirname } from 'path';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig([
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    rules: {
      'no-console': [
        isProduction ? 'error' : 'warn',
        {
          allow: isProduction ? [] : ['warn', 'error'],
        },
      ],
    },
  },
  tseslint.configs.recommended,
  {
    plugins: {
      prettier: prettierPlugin,
      import: importPlugin,
      'unused-imports': unusedImportsPlugin,
      promise: promisePlugin,
      unicorn: unicornPlugin,
      sonarjs: sonarjsPlugin,
    },
    extends: [...compat.extends('prettier')],
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      // prettier
      'prettier/prettier': ['error', {}, { usePrettierrc: true }],

      // React hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/react-in-jsx-scope': 'off',

      // import plugin
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/no-duplicates': 'error',

      // unused imports plugin — remove unused imports and vars
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // promise plugin
      'promise/always-return': 'error',
      'promise/no-return-wrap': 'error',
      'promise/catch-or-return': 'error',
      'promise/no-nesting': 'warn',
      'promise/no-promise-in-callback': 'warn',
      'promise/param-names': 'error',

      // unicorn plugin
      'unicorn/prefer-add-event-listener': 'error',
      'unicorn/prevent-abbreviations': 'warn',
      'unicorn/filename-case': 'off',
      'unicorn/prevent-abbreviations': [
        'warn',
        {
          checkFilenames: false,
          checkProperties: true,
          checkVariables: true,
          replacements: {
            props: false, // allow 'props' as a variable name
            fn: false, // allow 'fn' as a variable name
            cb: false, // allow 'cb' as a variable name
          },
        },
      ],

      // sonarjs plugin — example rules
      'sonarjs/no-duplicate-string': 'warn',
      'sonarjs/cognitive-complexity': ['warn', 15],
      'sonarjs/no-identical-functions': 'warn',
    },
  },
]);
