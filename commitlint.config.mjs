/** Conventional Commits, with scopes limited to the project's modules and areas. */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'core',
        'finance',
        'hr',
        'procurement',
        'inventory',
        'reporting',
        'web',
        'api',
        'shared',
        'config',
        'db',
        'ci',
        'deps',
        'docs',
      ],
    ],
  },
};
