import js from '@eslint/js';
import parser from '@typescript-eslint/parser';
import pluginTs from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'],
      },
    },
    plugins: {
      '@typescript-eslint': pluginTs,
      prettier,
      import: importPlugin,
      'unused-imports': unusedImportsPlugin,
    },
    rules: {
      'no-unused-vars': 'off',
      'prettier/prettier': 'error',
      'unused-imports/no-unused-imports': 'warn',
      'import/order': [
        'warn',
        {
          groups: [['builtin', 'external', 'internal']],
          'newlines-between': 'always',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
      ],
    },
  },
];