import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'

const browserGlobals = Object.fromEntries(
  Object.entries(globals.browser).map(([key, value]) => [key.trim(), value])
)

const nodeGlobals = Object.fromEntries(
  Object.entries(globals.node).map(([key, value]) => [key.trim(), value])
)

const jestGlobals = Object.fromEntries(
  Object.entries(globals.jest).map(([key, value]) => [key.trim(), value])
)

const mochaGlobals = Object.fromEntries(
  Object.entries(globals.mocha).map(([key, value]) => [key.trim(), value])
)

export default [
  { ignores: ['dist', 'public/**', '**/*.d.ts'] },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: browserGlobals,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...(tsPlugin.configs?.recommended?.rules ?? {}),
      // TypeScript handles undefined identifiers; `no-undef` is noisy on TS types.
      'no-undef': 'off',
      // Prefer the TS-aware unused-vars rule.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      // This repo currently uses `any` in a few boundaries; keep lint pragmatic.
      '@typescript-eslint/no-explicit-any': 'off',
      ...reactHooks.configs.recommended.rules,
    },
  },
  {
    // Fast-refresh rule only makes sense for actual React render entrypoints.
    files: ['src/components/**/*.{ts,tsx}', 'src/pages/**/*.{ts,tsx}'],
    plugins: {
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    // This module intentionally exports non-component helpers.
    files: ['src/components/ui/UserFeedback.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['**/*.{test,spec}.{ts,tsx,js,jsx}', '**/__tests__/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: {
        ...browserGlobals,
        ...jestGlobals,
      },
    },
    rules: {
      // Tests may use dynamic requires for mocking.
      '@typescript-eslint/no-var-requires': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['cypress/**/*.{ts,tsx,js,jsx}', 'cypress.config.{ts,js,mts,cts}'],
    languageOptions: {
      globals: {
        ...browserGlobals,
        ...mochaGlobals,
        cy: 'readonly',
        Cypress: 'readonly',
        expect: 'readonly',
      },
    },
    rules: {
      // Cypress type augmentation uses namespaces.
      '@typescript-eslint/no-namespace': 'off',
    },
  },
  {
    files: ['vite.config.ts', 'cypress.config.ts', '**/*.config.{ts,js,mts,cts}'],
    languageOptions: {
      globals: nodeGlobals,
    },
  },
  {
    files: ['test/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: {
        ...nodeGlobals,
        ...jestGlobals,
      },
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
]
