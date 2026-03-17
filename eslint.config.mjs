import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  // Don't run ESLint (with project-based TypeScript parser) on deployment config files
  {
    ignores: [
      'ecosystem.config.cjs',
      'ecosystem.dev.config.cjs',
      'ecosystem.prod.config.cjs',
      'scripts/**',
    ],
  },

  ...compat.extends('next/core-web-vitals', 'next/typescript', 'plugin:prettier/recommended'),

  {
    languageOptions: {
      parser: compat.plugins['@typescript-eslint/parser'],
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {},
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      // 🔹 Code Formatting
      'prettier/prettier': 'error',

      // 🔹 Best Practices
      'no-console': 'warn', // Warn on console logs, but don't block them
      'no-unused-vars': 'off', // Turn off the base rule as it can report incorrect errors
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Use the TypeScript-specific rule
      'no-debugger': 'error', // Prevent accidental debugger statements in production

      // 🔹 Code Quality
      eqeqeq: ['error', 'always'], // Enforce strict equality (`===` instead of `==`)
      curly: ['error', 'all'], // Require curly braces for conditionals
      'no-alert': 'warn', // Warn if `alert()`, `confirm()`, or `prompt()` is used

      // 🔹 TypeScript Specific
      '@typescript-eslint/no-explicit-any': 'warn', // Discourage `any`, but allow it if necessary
      '@typescript-eslint/explicit-function-return-type': 'off', // Don't force return types (Next.js handles many cases)
      '@typescript-eslint/ban-ts-comment': 'warn', // Allow ts-ignore but warn about it

      // 🔹 Import Rules
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],
      'import/no-unresolved': 'off', // Next.js handles module resolution
      'import/prefer-default-export': 'off', // Allow named exports freely
      'no-restricted-imports': [
        'error',
        {
          patterns: ['../*'], // Prevent relative imports that go up multiple levels
        },
      ],

      // 🔹 React/JSX Rules
      'react/jsx-boolean-value': ['error', 'never'], // `<Component loading />` instead of `<Component loading={true} />`
      'react/self-closing-comp': 'error', // Enforce self-closing for empty components
      'react/jsx-sort-props': [
        'warn',
        {
          callbacksLast: true,
          shorthandFirst: true,
          ignoreCase: true, // Ensures case-insensitive sorting
          reservedFirst: true,
          noSortAlphabetically: false, // Enables alphabetical sorting
        },
      ],
      'react-hooks/rules-of-hooks': 'error', // Ensure hooks follow rules
      'react-hooks/exhaustive-deps': 'warn', // Warn if dependencies in useEffect are incorrect
      'react/no-unescaped-entities': 'off',
      'react/react-in-jsx-scope': 'off', // Not needed with Next.js
      'react/jsx-uses-react': 'off', // Not needed with React 17+
      'react/prop-types': 'off', // Not needed with TypeScript
    },
  },
  // Override: don't use the TypeScript parser for CommonJS deployment config files
  {
    files: ['**/*.cjs'],
    excludedFiles: ['src/**', 'packages/**'],
    languageOptions: {
      // Use default JS parser (espree) for .cjs files so they aren't subject to type-aware rules
      parser: undefined,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'script',
      },
    },
    rules: {
      // Turn off rules that rely on TypeScript type information for these files
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
]

export default eslintConfig
