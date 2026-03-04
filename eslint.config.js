import tseslint from '@typescript-eslint/eslint-plugin';
import tsdoc from 'eslint-plugin-tsdoc';
import prettierConfig from 'eslint-config-prettier/flat';

export default [
  {
    ignores: ['node_modules', 'coverage', 'lib', '.vscode', 'api-docs'],
  },
  ...tseslint.configs['flat/recommended'],
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    plugins: { tsdoc },
    rules: {
      'tsdoc/syntax': 'warn',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'no-public' },
      ],
      '@typescript-eslint/member-ordering': [
        'warn',
        {
          default: {
            memberTypes: [
              // Static Fields
              'public-static-field',
              'protected-static-field',
              'private-static-field',

              // Static Methods
              'public-static-method',
              'protected-static-method',
              'private-static-method',

              // Instance Fields
              'public-instance-field',
              'public-abstract-field',
              'protected-instance-field',
              'protected-abstract-field',
              'private-instance-field',

              'constructor',

              // Instance Methods
              'public-instance-method',
              'public-abstract-method',
              'protected-instance-method',
              'protected-abstract-method',
              'private-instance-method',
            ],
            order: 'alphabetically',
          },
          interfaces: {
            memberTypes: ['signature', 'field', 'constructor', 'method'],
            order: 'alphabetically',
          },
          typeLiterals: {
            memberTypes: ['signature', 'field', 'constructor', 'method'],
            order: 'alphabetically',
          },
        },
      ],
    },
  },
  prettierConfig,
];
