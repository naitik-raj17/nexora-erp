// Shared flat ESLint config. Apps extend it in their own eslint.config.mjs.
import tseslint from 'typescript-eslint';

export default tseslint.config(...tseslint.configs.recommended, {
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/consistent-type-imports': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
});
