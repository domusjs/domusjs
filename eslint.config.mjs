import js from '@eslint/js';
import parser from '@typescript-eslint/parser';
import pluginTs from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import eslintPluginNode from 'eslint-plugin-node';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Calcula __filename y __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = __dirname;

export default [
  // Configuración recomendada de ESLint
  js.configs.recommended,

  // Reglas para TS (excluyendo archivos de configuración)
  {
    files: ['**/*.ts', '!**/*.config.ts'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        tsconfigRootDir: root,
        project: [
          join(root, 'tsconfig.json'),
          join(root, 'packages', '**', 'tsconfig.json'),
        ],
      },
    },
    plugins: {
      '@typescript-eslint': pluginTs,
      prettier,
      import: importPlugin,
      'unused-imports': unusedImportsPlugin,
      node: eslintPluginNode,
    },
    rules: {
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'prettier/prettier': 'error',
      'unused-imports/no-unused-imports': 'warn',
      'import/order': [
        'warn',
        {
          groups: [['builtin', 'external', 'internal']],
          'newlines-between': 'always',
        },
      ],
      '@typescript-eslint/no-unused-vars': ['warn'],
    },
  },

  // Reglas para archivos .config.ts sin chequeo de tipos
  {
    files: ['**/*.config.ts'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        tsconfigRootDir: root,
        project: null,
      },
    },
    plugins: {
      '@typescript-eslint': pluginTs,
      prettier,
      import: importPlugin,
      'unused-imports': unusedImportsPlugin,
      node: eslintPluginNode,
    },
    rules: {
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'prettier/prettier': 'error',
      'unused-imports/no-unused-imports': 'warn',
      'import/order': [
        'warn',
        {
          groups: [['builtin', 'external', 'internal']],
          'newlines-between': 'always',
        },
      ],
      '@typescript-eslint/no-unused-vars': ['warn'],
    },
  },
];
